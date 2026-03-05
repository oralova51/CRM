import type { SignInRequest, SignUpRequest, ValidationResult } from "./index";

export class UserValidator {
  static validateEmail(email: string): boolean {
    const emailPattern = /^[A-z0-9!-_%.]+@[A-z0-9.-]+\.[A-z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string): boolean {
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

  static validatePhone(phone: string): boolean {
    const phonePattern =
      /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return phonePattern.test(phone);
  }

  static validateSignUpData(data: SignUpRequest): ValidationResult {
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

  static validateSignInData(data: SignInRequest): ValidationResult {
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
