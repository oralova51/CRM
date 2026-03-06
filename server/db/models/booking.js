"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: "user_id" });
      Booking.belongsTo(models.Procedure, { foreignKey: "procedure_id" });
    }
  }

  Booking.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: 'CASCADE',
      },
      procedure_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Procedures",
          key: "id",
        },
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      price_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Цена, зафиксированная на момент записи',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Booking",  
      timestamps: true,      
    },
  );

  return Booking;
};