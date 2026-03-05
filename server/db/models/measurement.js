'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Measurement extends Model {
    static associate(models) {
      this.belongsTo(models.User, { as: 'client', foreignKey: 'user_id' });
      this.belongsTo(models.User, { as: 'creator', foreignKey: 'created_by' });
    }
  }
  Measurement.init({
    user_id: DataTypes.INTEGER,
    measured_at: DataTypes.DATE,
    waist_cm: DataTypes.DECIMAL,
    hips_cm: DataTypes.DECIMAL,
    hip_1: DataTypes.DECIMAL,
    chest_cm: DataTypes.DECIMAL,
    arms_cm: DataTypes.DECIMAL,
    photo_before: DataTypes.STRING,
    photo_after: DataTypes.STRING,
    notes: DataTypes.TEXT,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Measurement',
  });
  return Measurement;
};