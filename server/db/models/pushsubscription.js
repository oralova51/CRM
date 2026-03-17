// server/db/models/pushsubscription.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {
    static associate(models) {
      // Связь с пользователем
      PushSubscription.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  PushSubscription.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    endpoint: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true, // один endpoint = одна подписка
      comment: 'Уникальный URL подписки от браузера'
    },
    p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Публичный ключ для шифрования'
    },
    auth: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Секретный ключ аутентификации'
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Информация о браузере пользователя'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PushSubscription',
    tableName: 'PushSubscriptions',
    underscored: true, // используем snake_case для полей в БД
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PushSubscription;
};