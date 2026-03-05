const { Measurement } = require("../../db/models");
class MeasurementService {
  // static async getMeasurementById(id) {
  //   return await Measurement.findByPk(id);
  // }

static async getMeasurementByUserId(userId) {
    return await Measurement.findAll({ where: { user_id: userId } });
  }
  static async createNewMeasurement(measurementData) {
    return await Measurement.create(measurementData);
  }
  static async deleteMeasurementById(id) {
    const measurementToDelete = await Measurement.findByPk(id, userId);
    if (!measurementToDelete) return null;
    if (measurementToDelete.user_id !== userId) return null;
    return await measurementToDelete.destroy();
  }
  static async updateMeasurementById(id, measurementData) {
    const updateMeasurement = await Measurement.findByPk(id);
    // const {} = measurementData;
    if (!updateMeasurement) return null;
    await updateMeasurement.save();
    return updateMeasurement;
  }
  
}

module.exports = MeasurementService;
