"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AiMessage extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
    }
  }

  AiMessage.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      role: {
        type: DataTypes.ENUM("user", "assistant"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["user", "assistant"]],
            msg: "role must be either 'user' or 'assistant'",
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "content must not be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "AiMessage",
      tableName: "AiMessages",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );

  return AiMessage;
};
