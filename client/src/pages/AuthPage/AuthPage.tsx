import { useState } from "react";
import "./AuthPage.css";
import SignUpForm from "../../features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "../../features/auth/ui/SignInForm/SignInForm";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="app-container">
      <div className="form-container">
        {isSignUp ? <SignUpForm /> : <SignInForm />}
        {isSignUp ? (
          <>
            <p>Уже есть учетная запись?</p>
            <span className="auth-link" onClick={() => setIsSignUp(!isSignUp)}>
              Войти
            </span>
          </>
        ) : (
          <>
            <p>Еще нет учетной записи?</p>
            <span className="auth-link" onClick={() => setIsSignUp(!isSignUp)}>
              Создать
            </span>
          </>
        )}
      </div>
    </div>
  );
}
