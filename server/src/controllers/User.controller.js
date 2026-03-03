const UserService = require('../services/User.service');
const formatResponse = require('../utils/formatResponse');
const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');

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
              'Ошибка при продлении сессии',
              null,
              'Ошибка при продлении сессии',
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
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(
            200,
            'Пользовательская сессия продлена успешно',
            { user, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log('==== UserController.refreshTokens ==== ');
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
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
        .json(formatResponse(400, 'Ошибка валидации', null, error));
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
              'Пользователь с таким адресом электронной почты не зарегистрирован',
              null,
              'Пользователь с таким адресом электронной почты не зарегистрирован',
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
              'Неверные данные для входа',
              null,
              'Неверные данные для входа',
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
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(
            200,
            'Успешный логин',
            { user: existingUser, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log('==== UserController.signIn ==== ');
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
    }
  }

  static async signUp(req, res) {
    // Достаём данные для регистрации из тела запроса
    const { username, email, password } = req.body;

    // Валидация данных
    const { isValid, error } = User.validateSignUpData({
      username,
      email,
      password,
    });

    if (!isValid) {
      return res
        .status(400)
        .json(formatResponse(400, 'Ошибка валидации', null, error));
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
              'Пользователь с таким адресом электронной почты уже зарегистрирован',
              null,
              'Пользователь с таким адресом электронной почты уже зарегистрирован',
            ),
          );
      }
      // Хэшируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаем пользователя в БД
      const newUser = await UserService.createNewUser({
        username,
        email,
        password: hashedPassword,
      });

      if (!newUser) {
        return res
          .status(500)
          .json(
            formatResponse(
              500,
              'Ошибка при создании пользователя',
              null,
              'Ошибка при создании пользователя',
            ),
          );
      }
      // Удаляем пароль из объекта пользователя
      delete newUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: newUser });

      res
        .status(201)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json(
          formatResponse(
            201,
            'Регистрация успешна',
            { user: newUser, accessToken },
            null,
          ),
        );
    } catch (error) {
      console.log('==== UserController.signUp ==== ');
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
    }
  }

  static async signOut(req, res) {
    try {
      res
        .status(200)
        .clearCookie('refreshToken')
        .json(formatResponse(200, 'Успешный выход из приложения'));
    } catch (error) {
      console.log('==== UserController.signOut ==== ');
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, 'Внутренняя ошибка сервера', null, error));
    }
  }
}

module.exports = UserController;
