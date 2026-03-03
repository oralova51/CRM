import { useState } from "react";
import "./AuthPage.css";
import SignUpForm from "../../features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "../../features/auth/ui/SignInForm/SignInForm";
import { Button } from "@/shared/ui/Button/Button";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isSignUp ? "Создать аккаунт" : "Вход в CRM"}
          </h1>
          <p className="auth-subtitle">
            Управляйте задачами и клиентами в одном месте.
          </p>
        </div>

        <div className="auth-form-wrapper">
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>

        <div className="auth-toggle">
          <p className="auth-toggle-text">
            {isSignUp ? "Уже есть учетная запись?" : "Еще нет учетной записи?"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth
            className="auth-toggle-button"
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp ? "Войти" : "Создать аккаунт"}
          </Button>
        </div>
      </div>
    </div>
  );
}
