import { useState } from "react";
import { useNavigate } from "react-router";
import { UserValidator } from "@/entities/user/model/UserValidator";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { signInThunk } from "@/entities/user/api/UserApi";
import styles from "./SignInForm.module.css";
import { useToast } from '@/shared/lib/toast/ToastContext';

export default function SignInForm() {
  const initialValue = { email: "", password: "" };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signInData, setSignInData] = useState(initialValue);
  const toast = useToast();

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const signInHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error: validationError } =
      UserValidator.validateSignInData(signInData);

    if (!isValid) {
      toast.error(validationError || 'Ошибка валидации');
      return;
    }
    try {
      await dispatch(signInThunk(signInData)).unwrap();
      toast.success('Успешный вход! Добро пожаловать!');
      navigate("/");
    } catch (error) {
      toast.error('Неверный email или пароль');
    }
  };

  return (
    <form className={styles.form} onSubmit={signInHandler}>
      <div className={styles.fields}>
        <Input
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signInData.email}
          label="Почта"
          placeholder="you@example.com"
        />
        <Input
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signInData.password}
          label="Пароль"
          placeholder="Введите пароль"
        />
      </div>
      <Button type="submit" fullWidth>
        Войти
      </Button>
    </form>
  );
}