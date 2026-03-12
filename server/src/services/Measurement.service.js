const { Measurement } = require("../../db/models");
class MeasurementService {
  static async getAllMeasurement() {
    return await Measurement.findAll();
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
    if (!measurementData) return;

    const measurementToUpdate = await Measurement.findByPk(id);
    console.log("Found measurement in service:", measurementToUpdate);

    if (!measurementToUpdate) return null;

    // Обновляем только переданные поля
    if (measurementData.measured_at !== undefined)
      measurementToUpdate.measured_at = measurementData.measured_at;
    if (measurementData.waist_cm !== undefined)
      measurementToUpdate.waist_cm = measurementData.waist_cm;
    if (measurementData.hips_cm !== undefined)
      measurementToUpdate.hips_cm = measurementData.hips_cm;
    if (measurementData.hip_1 !== undefined)
      measurementToUpdate.hip_1 = measurementData.hip_1;
    if (measurementData.chest_cm !== undefined)
      measurementToUpdate.chest_cm = measurementData.chest_cm;
    if (measurementData.arms_cm !== undefined)
      measurementToUpdate.arms_cm = measurementData.arms_cm;
    if (measurementData.photo_before !== undefined)
      measurementToUpdate.photo_before = measurementData.photo_before;
    if (measurementData.photo_after !== undefined)
      measurementToUpdate.photo_after = measurementData.photo_after;
    if (measurementData.notes !== undefined)
      measurementToUpdate.notes = measurementData.notes;

    console.log("Measurement before save:", measurementToUpdate);

    await measurementToUpdate.save();

    console.log("Measurement after save:", measurementToUpdate);

    return measurementToUpdate;
  }
}

module.exports = MeasurementService;
