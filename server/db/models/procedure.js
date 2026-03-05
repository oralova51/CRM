"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Procedure extends Model {
    static associate(models) {
      // здесь будут связи позже
    }
  }

  Procedure.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, // может быть пустым
      },
      duration_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, 
      },
    },
    {
      sequelize,
      modelName: "Procedure",
      timestamps: true, 
    }
  );

  return Procedure;
};