const MeasurementService = require("../services/Measurement.service");
const formatResponse = require("../utils/formatResponse");

class MeasurementController {
  static async adminGetMeasurementByUserId(req, res) {
    try {
      const { user: adminUser } = res.locals;
      const { userId } = req.params;
      if (adminUser.role !== "isAdmin") {
        return res
          .status(403)
          .json(formatResponse(403, "Доступ запрещён: недостаточно прав"));
      }
      if (!userId || isNaN(Number(userId))) {
        return res
          .status(400)
          .json(formatResponse(400, "Некорректный ID пользователя"));
      }
      const userMeasurement =
        await MeasurementService.getMeasurementByUserId(userId);
      if (userMeasurement.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, "У данного пользователя пока нет замеров"));
      }
      res
        .status(200)
        .json(formatResponse(200, "Замеры получены", userMeasurement));
    } catch (error) {
      console.log(error);
      console.log(
        "==== MeasurementController.adminGetMeasurementByUserId ==== ",
      );
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера"));
    }
  }
  static async getAllMeasurement(req, res) {
    try {
      const measurement = await MeasurementService.getAllMeasurement();
      return res.status(200).json(formatResponse(200, "Succes", measurement));
    } catch (error) {
      console.log(error);
      console.log("==== MeasurementController.getAllMeasurement ==== ");
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера"));
    }
  }
  static async getUserMeasurement(req, res) {
    try {
      const { user } = res.locals;
      if (!user) {
        return res
          .status(401)
          .json(formatResponse(401, "Авторизуйтесь, пожалуйста"));
      }
      const userMeasurement = await MeasurementService.getMeasurementByUserId(
        user.id,
      );
      if (userMeasurement.length === 0) {
        return res
          .status(200)
          .json(formatResponse(200, "У Вас пока нет замеров"));
      }
      res
        .status(200)
        .json(formatResponse(200, "Замеры получены", userMeasurement));
    } catch (error) {
      console.log(error);
      console.log("==== MeasurementController.getUserMeasurement ==== ");
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера"));
    }
  }

  static async createMeasurement(req, res) {
    const {
      user_id, //client
      measured_at,
      waist_cm,
      hips_cm,
      hip_1,
      chest_cm,
      arms_cm,
      photo_before,
      photo_after,
      notes,
    } = req.body;
    const { user } = res.locals; // admin

    if (!user || !user.id) {
      return res
        .status(401)
        .json(formatResponse(401, "Авторизуйтесь, пожалуйста"));
    }

    if (!user_id) {
      // ← Проверяем, что передан ID клиента
      return res.status(400).json(formatResponse(400, "Не указан ID клиента"));
    }

    if (
      arms_cm === undefined ||
      arms_cm === null ||
      typeof arms_cm !== "number"
    ) {
      return res
        .status(400)
        .json(formatResponse(400, "Заполните поле arms_cm"));
    }

    if (
      chest_cm === undefined ||
      chest_cm === null ||
      typeof chest_cm !== "number"
    ) {
      return res
        .status(400)
        .json(formatResponse(400, "Заполните поле chest_cm"));
    }

    if (!measured_at) {
      return res
        .status(400)
        .json(formatResponse(400, "Заполните поле measured_at"));
    }

    if (
      waist_cm === undefined ||
      waist_cm === null ||
      typeof waist_cm !== "number"
    ) {
      return res
        .status(400)
        .json(formatResponse(400, "Заполните поле waist_cm"));
    }

    if (
      hips_cm === undefined ||
      hips_cm === null ||
      typeof hips_cm !== "number"
    ) {
      return res
        .status(400)
        .json(formatResponse(400, "Заполните поле hips_cm"));
    }

    if (hip_1 === undefined || hip_1 === null || typeof hip_1 !== "number") {
      return res.status(400).json(formatResponse(400, "Заполните поле hip_1"));
    }

    try {
      const newMeasurement = await MeasurementService.createNewMeasurement({
        user_id, //client
        measured_at,
        waist_cm,
        hips_cm,
        hip_1,
        chest_cm,
        arms_cm,
        photo_before,
        photo_after,
        notes,
        created_by: user.id, //admin
      });

      res.status(201).json(formatResponse(201, "Замер создан", newMeasurement));
    } catch (error) {
      console.log("==== MeasurementController.createMeasurement ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  static async deleteMeasurement(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(formatResponse(400, "Некорректный формат ID"));
    }

    try {
      const deletedMeasurement = await MeasurementService.deleteMeasurementById(
        Number(id),
      );

      if (!deletedMeasurement) {
        return res
          .status(404)
          .json(formatResponse(404, `Замеры с ID: ${id} не найдены`));
      }

      res.status(200).json(formatResponse(200, "Замеры удалены"));
    } catch (error) {
      console.log("==== MeasurementController.deleteMeasurement ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }

  // static async updateMeasurement(req, res) {
  //   const { id } = req.params;
  //   const {
  //     user_id,
  //     measured_at,
  //     waist_cm,
  //     hips_cm,
  //     hip_1,
  //     chest_cm,
  //     arms_cm,
  //     photo_before,
  //     photo_after,
  //     notes,
  //   } = req.body;

  //   const { user } = res.locals;

  //   if (isNaN(Number(id))) {
  //     return res
  //       .status(400)
  //       .json(formatResponse(400, "Некорректный формат ID"));
  //   }

  //   try {
  //     const measurementToUpdate =
  //       await MeasurementService.updateMeasurementById(Number(id));

  //     if (!measurementToUpdate) {
  //       return res
  //         .status(404)
  //         .json(formatResponse(404, `Замеры с ID: ${id} не найдены`));
  //     }
  //     if (user.role !== "isAdmin" && measurementToUpdate.user_id !== user.id) {
  //       return res
  //         .status(403)
  //         .json(formatResponse(403, "Нет прав для обновления этого замера"));
  //     }
  //     const updateData = {};

  //     if (measured_at !== underined)
  //       updateMeasurement.measured_at = measured_at;
  //     if (waist_cm !== underined) updateMeasurement.waist_cm = waist_cm;
  //     if (hips_cm !== underined) updateMeasurement.hips_cm = hips_cm;
  //     if (hip_1 !== underined) updateMeasurement.hip_1 = hip_1;
  //     if (chest_cm !== underined) updateMeasurement.chest_cm = chest_cm;
  //     if (arms_cm !== underined) updateMeasurement.arms_cm = arms_cm;
  //     if (photo_before !== underined)
  //       updateMeasurement.photo_before = photo_before;
  //     if (photo_after !== underined)
  //       updateMeasurement.photo_after = photo_after;
  //     if (notes !== underined) updateMeasurement.notes = notes;

  //      console.log("Updating measurement with data:", updateData); // Для отладки

  //     const updatedMeasurement = await MeasurementService.updateMeasurementById(
  //       Number(id),
  //       updateData,
  //     );
  //     if (!updatedMeasurement) {
  //       return res
  //         .status(404)
  //         .json(formatResponse(404, `Замеры с ID: ${id} не найдены`));
  //     }
  //     res
  //       .status(200)
  //       .json(formatResponse(200, "Замер обновлен", updatedMeasurement));
  //   } catch (error) {
  //     console.log("==== MeasurementController.updateMeasurement ==== ");
  //     console.log(error);
  //     res
  //       .status(500)
  //       .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
  //   }
  // }

  static async updateMeasurement(req, res) {
    console.log("=== UPDATE MEASUREMENT CONTROLLER ===");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    console.log("res.locals.user:", res.locals.user);

    const { id } = req.params;
    const {
      user_id,
      measured_at,
      waist_cm,
      hips_cm,
      hip_1,
      chest_cm,
      arms_cm,
      photo_before,
      photo_after,
      notes,
    } = req.body;

    const { user } = res.locals;

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(formatResponse(400, "Некорректный формат ID"));
    }

    try {
      // Находим замер, который хотим обновить
      const measurementToUpdate = await MeasurementService.getMeasurementById(
        Number(id),
      );
      console.log("Found measurement:", measurementToUpdate);

      if (!measurementToUpdate) {
        return res
          .status(404)
          .json(formatResponse(404, `Замер с ID: ${id} не найден`));
      }

      // Проверка прав
      if (user.role !== "isAdmin" && measurementToUpdate.user_id !== user.id) {
        return res
          .status(403)
          .json(formatResponse(403, "Нет прав для обновления этого замера"));
      }

      // Подготавливаем данные для обновления
      const updateData = {
        measured_at,
        waist_cm,
        hips_cm,
        hip_1,
        chest_cm,
        arms_cm,
        photo_before,
        photo_after,
        notes,
      };

      // Удаляем undefined поля
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      );

      console.log("Update data prepared:", updateData);

      // Проверяем, есть ли что обновлять
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json(formatResponse(400, "Нет данных для обновления"));
      }

      // ВАЖНО: передаем id и updateData
      const updatedMeasurement = await MeasurementService.updateMeasurementById(
        Number(id),
        updateData, // ← передаем объект с данными
      );

      console.log("Updated measurement:", updatedMeasurement);

      if (!updatedMeasurement) {
        return res
          .status(404)
          .json(formatResponse(404, `Замер с ID: ${id} не найден`));
      }

      res
        .status(200)
        .json(
          formatResponse(200, "Замер обновлен успешно", updatedMeasurement),
        );
    } catch (error) {
      console.log("==== MeasurementController.updateMeasurement ==== ");
      console.log("Error details:", error);
      res
        .status(500)
        .json(
          formatResponse(500, "Внутренняя ошибка сервера", null, error.message),
        );
    }
  }
}

module.exports = MeasurementController;
