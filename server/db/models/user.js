"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: 'user_id' });
      this.hasMany(models.AiMessage, { foreignKey: 'user_id' });
      this.hasMany(models.PushSubscription, {
        foreignKey: 'user_id',
        as: 'pushSubscriptions'
      });
    }

    static validateEmail(email) {
      const emailPattern = /^[A-z0-9!-_%.]+@[A-z0-9.-]+\.[A-z]{2,}$/;
      return emailPattern.test(email);
    }

    static validatePassword(password) {
      const hasUppercase = /[A-Z]/;
      const hasLowercase = /[a-z]/;
      const hasDigits = /\d/;
      const hasSpecialCharacters = /[!@#$%^&*(),.:"{}|<>]/;
      const isValidLength = password.length >= 8;

      if (
        !hasUppercase.test(password) ||
        !hasLowercase.test(password) ||
        !hasDigits.test(password) ||
        !hasSpecialCharacters.test(password) ||
        !isValidLength
      ) {
        return false;
      }
      return true;
    }

    static validatePhone(phone) {
      // Паттерн для российских номеров: +7 (XXX) XXX-XX-XX или 8XXXXXXXXXX или +7XXXXXXXXXX
      const phonePattern =
        /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
      return phonePattern.test(phone);
    }

    static validateSignUpData(data) {
      const { name, email, password, phone } = data;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return {
          isValid: false,
          error: "Имя пользователя не должно быть пустым",
        };
      }

      if (
        !email ||
        typeof email !== "string" ||
        email.trim().length === 0 ||
        !this.validateEmail(email)
      ) {
        return {
          isValid: false,
          error: "Ошибка валидации адреса электронной почты",
        };
      }

      if (
        !password ||
        typeof password !== "string" ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          error: "Пароль не соответствует критериям валидации",
        };
      }

      if (
        !phone ||
        typeof phone !== "string" ||
        phone.trim().length === 0 ||
        !this.validatePhone(phone)
      ) {
        return {
          isValid: false,
          error: "Неверный формат номера телефона",
        };
      }

      return { isValid: true, error: null };
    }

    static validateSignInData(data) {
      const { email, password } = data;

      if (
        !email ||
        typeof email !== "string" ||
        email.trim().length === 0 ||
        !this.validateEmail(email)
      ) {
        return {
          isValid: false,
          error: "Ошибка валидации адреса электронной почты",
        };
      }

      if (
        !password ||
        typeof password !== "string" ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          error: "Пароль не соответствует критериям валидации",
        };
      }

      return { isValid: true, error: null };
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalSpent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      role: {
        type: DataTypes.ENUM("isAdmin", "isClient"),
        allowNull: false,
        defaultValue: "isClient",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (newUser) => {
          newUser.email = newUser.email.toLowerCase().trim();
        },
      },
    },
  );
  return User;
};
