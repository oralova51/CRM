"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    
    static associate(models) {
      // Order принадлежит пользователю
      Order.belongsTo(models.User, { foreignKey: "user_id", as: "user"});
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "canceled"),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("card", "cash", "online"),
        allowNull: false,
      },
      discount_pct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      final_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );

  return Order;
};