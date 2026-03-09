const MeasurementService = require("../services/Measurement.service");
const formatResponse = require("../utils/formatResponse");

class MeasurementController {
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

    if (!user || !user.id) {
      return res
        .status(401)
        .json(formatResponse(401, "Авторизуйтесь, пожалуйста"));
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
        user_id: user.id,
        measured_at,
        waist_cm,
        hips_cm,
        hip_1,
        chest_cm,
        arms_cm,
        photo_before,
        photo_after,
        notes,
        created_by: user.id,
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

  static async updateMeasurement(req, res) {
    const { id } = req.params;
    const {
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

    if (isNaN(Number(id))) {
      return res
        .status(400)
        .json(formatResponse(400, "Некорректный формат ID"));
    }

    try {
      const updatedMeasurement = await MeasurementService.updateMeasurementById(
        Number(id),
        {
          measured_at,
          waist_cm,
          hips_cm,
          hip_1,
          chest_cm,
          arms_cm,
          photo_before,
          photo_after,
          notes,
        },
      );

      if (!updatedMeasurement) {
        return res
          .status(404)
          .json(formatResponse(404, `Замеры с ID: ${id} не найдены`));
      }

      res
        .status(200)
        .json(
          formatResponse(200, "Задача обновлена успешно", updatedMeasurement),
        );
    } catch (error) {
      console.log("==== MeasurementController.updateMeasurement ==== ");
      console.log(error);
      res
        .status(500)
        .json(formatResponse(500, "Внутренняя ошибка сервера", null, error));
    }
  }
}

module.exports = MeasurementController;
