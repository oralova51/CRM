const ProcedureService = require("../services/Procedure.service");
const formatResponse = require("../utils/formatResponse");

class ProcedureController {
  static async getProcedures(req, res) {
    try {
      const procedures = await ProcedureService.getAllProcedures();

      if (procedures.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, "В базе данных нет процедур", [], null));
      }

      res
        .status(200)
        .json(
          formatResponse(200, "Данные о процедурах получены", procedures, null),
        );
    } catch (error) {
      console.log("==== ProcedureController.getProcedures ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async getOneProcedure(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Некорректный формат ID",
            null,
            "Некорректный формат ID",
          ),
        );
    }

    try {
      const procedure = await ProcedureService.getProcedureById(Number(id));

      if (!procedure) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Процедура с ID: ${id} не найдена`,
              null,
              `Процедура с ID: ${id} не найдена`,
            ),
          );
      }

      res
        .status(200)
        .json(
          formatResponse(200, "Данные о процедуре получены", procedure, null),
        );
    } catch (error) {
      console.log("==== ProcedureController.getOneProcedure ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async createProcedure(req, res) {
    const { user } = res.locals;
    const { name, description, duration_min, price, is_active } = req.body;

    // Проверка прав доступа
    if (user.role !== "isAdmin") {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещен. Только администраторы могут создавать процедуры",
            null,
            "Forbidden",
          ),
        );
    }

    // Валидация name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Название процедуры не должно быть пустым",
            null,
            "Название процедуры не должно быть пустым",
          ),
        );
    }

    // Валидация duration_min (число)
    if (
      duration_min === undefined ||
      typeof duration_min !== "number" ||
      duration_min <= 0
    ) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Длительность процедуры должна быть положительным числом",
            null,
            "Длительность должна быть положительным числом",
          ),
        );
    }

    // Валидация price (число)
    if (price === undefined || typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Цена процедуры должна быть положительным числом",
            null,
            "Цена должна быть положительным числом",
          ),
        );
    }

    try {
      const newProcedure = await ProcedureService.createNewProcedure({
        name: name.trim(),
        description: description || null, // если description не передан или пустой, сохраняем null
        duration_min,
        price,
        is_active: is_active !== undefined ? is_active : true, // значение по умолчанию
      });

      res
        .status(201)
        .json(
          formatResponse(201, "Процедура создана успешно", newProcedure, null),
        );
    } catch (error) {
      console.log("==== ProcedureController.createProcedure ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async deleteProcedure(req, res) {
    const { user } = res.locals;

    // Проверяем, что пользователь - администратор
    if (user.role !== "isAdmin") {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещен. Только администраторы могут создавать процедуры",
            null,
            "Forbidden",
          ),
        );
    }

    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Некорректный формат ID",
            null,
            "Некорректный формат ID",
          ),
        );
    }

    try {
      const deletedProcedure = await ProcedureService.deleteProcedureById(
        Number(id),
      );

      if (!deletedProcedure) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `процедура с ID: ${id} не найдена`,
              null,
              `процедура с ID: ${id} не найдена`,
            ),
          );
      }

      res.status(200).json(formatResponse(200, "Процедура удалена успешно"));
    } catch (error) {
      console.log("==== ProcedureController.deleteProcedure ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async updateProcedure(req, res) {
    const { id } = req.params;
    const { name, description, duration_min, price, is_active } = req.body;

    const { user } = res.locals;

    // Проверяем, что пользователь - администратор
    if (user.role !== "isAdmin") {
      return res
        .status(403)
        .json(
          formatResponse(
            403,
            "Доступ запрещен. Только администраторы могут создавать процедуры",
            null,
            "Forbidden",
          ),
        );
    }

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(
          formatResponse(
            400,
            "Некорректный формат ID",
            null,
            "Некорректный формат ID",
          ),
        );
    }

    try {
      const updatedProcedure = await ProcedureService.updateProcedureById(
        Number(id),
        {
          name,
          description,
          duration_min,
          price,
          is_active,
        },
      );

      if (!updatedProcedure) {
        return res
          .status(404)
          .json(
            formatResponse(
              404,
              `Процедура с ID: ${id} не найдена`,
              null,
              `Процедура с ID: ${id} не найдена`,
            ),
          );
      }

      res
        .status(200)
        .json(
          formatResponse(200, "Процедура обновлена успешно", updatedProcedure),
        );
    } catch (error) {
      console.log("==== ProcedureController.updateProcedure ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
}

module.exports = ProcedureController;
