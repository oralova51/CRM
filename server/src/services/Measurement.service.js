const { Measurement } = require("../../db/models");

class MeasurementService {
  static async getAllMeasurement() {
    return await Measurement.findAll({
      order: [["measured_at", "DESC"]],
    });
  }

  static async getMeasurementById(id) {
    return await Measurement.findByPk(id);
  }

  static async getMeasurementByUserId(userId) {
    return await Measurement.findAll({
      where: { user_id: userId },
      order: [["measured_at", "DESC"]],
    });
  }

  static async createNewMeasurement(measurementData) {
    return await Measurement.create(measurementData);
  }

  static async deleteMeasurementById(id) {
    const measurementToDelete = await Measurement.findByPk(id);
    if (!measurementToDelete) return null;
    return await measurementToDelete.destroy();
  }

  static async updateMeasurementById(id, measurementData) {
    const updateMeasurement = await Measurement.findByPk(id);
    if (!updateMeasurement) return null;

    const {
      measured_at,
      waist_cm,
      hips_cm,
      hip_1,
      chest_cm,
      arms_cm,
      notes,
    } = measurementData;

    // Обновляем только переданные поля
    if (measured_at !== undefined) updateMeasurement.measured_at = measured_at;
    if (waist_cm !== undefined) updateMeasurement.waist_cm = waist_cm;
    if (hips_cm !== undefined) updateMeasurement.hips_cm = hips_cm;
    if (hip_1 !== undefined) updateMeasurement.hip_1 = hip_1;
    if (chest_cm !== undefined) updateMeasurement.chest_cm = chest_cm;
    if (arms_cm !== undefined) updateMeasurement.arms_cm = arms_cm;
    if (notes !== undefined) updateMeasurement.notes = notes;

    await updateMeasurement.save();
    return updateMeasurement;
  }

  // ✅ НОВЫЙ МЕТОД: Обновление фото замера
  static async updateMeasurementPhoto(id, photoField, photoUrl) {
    const measurement = await Measurement.findByPk(id);
    if (!measurement) return null;

    // Проверяем, что photoField - допустимое поле
    if (photoField !== 'photo_before' && photoField !== 'photo_after') {
      throw new Error('Недопустимое поле фото');
    }

    measurement[photoField] = photoUrl;
    await measurement.save();
    return measurement;
  }

  // ✅ НОВЫЙ МЕТОД: Получение замеров пользователя с фото
  static async getUserMeasurementsWithPhotos(userId) {
    return await Measurement.findAll({
      where: { user_id: userId },
      order: [["measured_at", "DESC"]],
      attributes: [
        'id',
        'measured_at',
        'waist_cm',
        'hips_cm',
        'hip_1',
        'chest_cm',
        'arms_cm',
        'photo_before',
        'photo_after',
        'notes',
        'created_by',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  // ✅ НОВЫЙ МЕТОД: Удаление фото из замера
  static async removeMeasurementPhoto(id, photoField) {
    const measurement = await Measurement.findByPk(id);
    if (!measurement) return null;

    if (photoField !== 'photo_before' && photoField !== 'photo_after') {
      throw new Error('Недопустимое поле фото');
    }

    measurement[photoField] = null;
    await measurement.save();
    return measurement;
  }
}

module.exports = MeasurementService;