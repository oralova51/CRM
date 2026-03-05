'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoyaltyLevel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LoyaltyLevel.init({
    name: DataTypes.STRING,
    min_spent: DataTypes.INTEGER,
    discount_pct: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LoyaltyLevel',
  });
  return LoyaltyLevel;
};