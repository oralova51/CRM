// client/src/pages/AuthPage/AuthPage.tsx

import { useState } from "react";
import SignUpForm from "../../features/auth/ui/SignUpForm/SignUpForm";
import SignInForm from "../../features/auth/ui/SignInForm/SignInForm";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isSignUp ? "Создать аккаунт" : "Вход в CRM"}
          </h1>
          <p className={styles.subtitle}>
            Управляйте задачами и клиентами в одном месте.
          </p>
        </div>

        <div className={styles.formWrapper}>
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </div>

        <div className={styles.toggle}>
          <p className={styles.toggleText}>
            {isSignUp ? "Уже есть учетная запись?" : "Еще нет учетной записи?"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth
            className={styles.toggleButton}
            onClick={() => setIsSignUp((prev) => !prev)}
          >
            {isSignUp ? "Войти" : "Создать аккаунт"}
          </Button>
        </div>
      </div>
    </div>
  );
}