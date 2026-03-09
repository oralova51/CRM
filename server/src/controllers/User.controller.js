const UserService = require("../services/User.service");
const formatResponse = require("../utils/formatResponse");
const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const generateTokens = require("../utils/generateTokens");
const cookieConfig = require("../configs/cookieConfig");

class UserController {
  static async refreshTokens(req, res) {
    // Достаём данные пользователя из res.locals, там он появился благодаря  мидлваре verifyRefreshToken
    try {
      const { user } = res.locals;

      if (!user) {
        return res
          .status(401)
          .json(
            formatResponse(
              401,
              "Ошибка при продлении сессии",
              null,
              "Ошибка при продлении сессии",
            ),
          );
      }

      // Выписываем новые токены
      const { accessToken, refreshToken } = generateTokens({
        user,
      });
      // refreshToken - отправляем в cookie, accessToken и user отправляем в ответе от сервера
      res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(
            200,
            "Пользовательская сессия продлена успешно",
            { user, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log("==== UserController.refreshTokens ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async signIn(req, res) {
    // Достаём данные для логина из тела запроса
    const { email, password } = req.body;

    // Валидация данных
    const { isValid, error } = User.validateSignInData({
      email,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, "Ошибка валидации", null, error));
    }

    // Нормализация адреса эл. почты
    const normalizedEmail = email.toLowerCase().trim();

    try {
      // Проверяем наличие пользователя с таким email
      const existingUser = await UserService.getUserByEmail(normalizedEmail);

      if (!existingUser) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              "Пользователь с таким адресом электронной почты не зарегистрирован",
              null,
              "Пользователь с таким адресом электронной почты не зарегистрирован",
            ),
          );
      }
      // сравниваем хэш пароля с хэшем из БД
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isValidPassword) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Неверные данные для входа",
              null,
              "Неверные данные для входа",
            ),
          );
      }

      // Удаляем пароль из объекта пользователя
      delete existingUser.password;

      // Выписываем новые токены
      const { accessToken, refreshToken } = generateTokens({
        user: existingUser,
      });
      // refreshToken - отправляем в cookie, accessToken и user отправляем в ответе от сервера
      res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(
            200,
            "Успешный логин",
            { user: existingUser, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log("==== UserController.signIn ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async signUp(req, res) {
    // Достаём данные для регистрации из тела запроса
    const { name, email, password, phone } = req.body;

    // Валидация данных
    const { isValid, error } = User.validateSignUpData({
      name,
      email,
      password,
      phone,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, "Ошибка валидации", null, error));
    }

    // Нормализация адреса эл. почты
    const normalizedEmail = email.toLowerCase().trim();

    try {
      // Проверяем наличие пользователя с таким email
      const existingUser = await UserService.getUserByEmail(normalizedEmail);

      if (existingUser) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Пользователь с таким адресом электронной почты уже зарегистрирован",
              null,
              "Пользователь с таким адресом электронной почты уже зарегистрирован",
            ),
          );
      }
      // Хэшируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаем пользователя в БД
      const newUser = await UserService.createNewUser({
        name,
        email,
        password: hashedPassword,
        phone,
        role: "isClient", // Явно устанавливаем роль клиента
        totalSpent: 0.0, // Явно устанавливаем начальную сумму
      });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              "Ошибка при создании пользователя",
              null,
              "Ошибка при создании пользователя",
            ),
          );
      }
      // Удаляем пароль из объекта пользователя
      delete newUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: newUser });

      res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieConfig)
        .json(
          formatResponse(
            201,
            "Регистрация успешна",
            { user: newUser, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log("==== UserController.signUp ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async signOut(req, res) {
    try {
      res
        .status(200)
        .clearCookie("refreshToken")
        .json(formatResponse(200, "Успешный выход из приложения"));
    } catch (error) {
      console.log("==== UserController.signOut ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async getMe(req, res) {
    try {
      const { user } = res.locals;

      // Читаем актуальные данные из БД, чтобы totalSpent не был устаревшим из JWT
      const freshUser = await User.findByPk(user.id, {
        attributes: { exclude: ["password"] },
      });

      if (!freshUser) {
        return res
          .status(404)
          .json(formatResponse(404, "Пользователь не найден", null, "User not found"));
      }

      res
        .status(200)
        .json(
          formatResponse(
            200,
            "Данные о пользователе получены",
            freshUser,
            null,
          ),
        );
    } catch (error) {
      console.log("==== UserController.getMe ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  //возможность менять totalSpent при оформлении заказа, для корректного отображения в профиле клиента
  //totalSpent может менять только админ

  static async totalSpentChanger(req, res) {
    try {
      const { user: adminUser } = res.locals;

      // Проверка прав администратора
      if (adminUser.role !== "isAdmin") {
        return res
          .status(403)
          .json(
            formatResponse(
              403,
              "Доступ запрещён: недостаточно прав",
              null,
              "Доступ запрещён: недостаточно прав",
            ),
          );
      }

      const { userId, amount } = req.body;

      // Валидация входных данных
      if (!userId) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Не указан ID пользователя",
              null,
              "Missing userId",
            ),
          );
      }

      if (amount === undefined || amount === null) {
        return res
          .status(400)
          .json(
            formatResponse(400, "Не указана сумма", null, "Missing amount"),
          );
      }

      // Проверяем, что amount - число
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Сумма должна быть числом",
              null,
              "Invalid amount format",
            ),
          );
      }

      // Дополнительно: проверяем, что сумма не слишком большая
      if (amountNum > 99999999.99) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Сумма превышает допустимый лимит",
              null,
              "Amount too large",
            ),
          );
      }

      const updatedUser = await UserService.totalSpentChanger(
        userId,
        amountNum,
      );

      // Преобразуем totalSpent в число для ответа (если в модели нет геттера)
      const responseUser = {
        ...updatedUser,
        totalSpent: parseFloat(updatedUser.totalSpent),
      };

      res
        .status(200)
        .json(
          formatResponse(
            200,
            "Сумма totalSpent успешно обновлена",
            responseUser,
            null,
          ),
        );
    } catch (error) {
      console.log("==== UserController.totalSpentChanger ==== ");
      console.log(error);

      if (error.message === "User not found") {
        return res
          .status(404)
          .json(
            formatResponse(404, "Пользователь не найден", null, error.message),
          );
      }

      res
        .status(500)
        .json(
          formatResponse(500, "Внутренняя ошибка сервера", null, error.message),
        );
    }
  }
}

module.exports = UserController;
