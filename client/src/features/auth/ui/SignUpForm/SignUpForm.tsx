import { useState } from "react";
import { useNavigate } from "react-router";
import { UserValidator } from "@/entities/user/model/UserValidator";
import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { signUpThunk } from "@/entities/user/api/UserApi";
import styles from "./SignUpForm.module.css";
import { useToast } from '@/shared/lib/toast/ToastContext';

export default function SignUpForm() {
  const initialValue = { name: "", email: "", password: "", phone: "" };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signUpData, setSignUpData] = useState(initialValue);
  const toast = useToast();

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const signUpHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error: validationError } =
      UserValidator.validateSignUpData(signUpData);

    if (!isValid) {
      toast.error(validationError || 'Ошибка валидации');
      return;
    }
    try {
      await dispatch(signUpThunk(signUpData)).unwrap();
      toast.success('Регистрация успешна! Добро пожаловать!');
      navigate("/");
    } catch (error) {
      toast.error('Ошибка при регистрации. Попробуйте позже.');
    }
  };

  return (
    <form className={styles.form} onSubmit={signUpHandler}>
      <div className={styles.fields}>
        <Input
          name="name"
          type="text"
          required
          onChange={inputHandler}
          value={signUpData.name}
          label="Имя"
          placeholder="Как к вам обращаться"
        />
        <Input
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signUpData.email}
          label="Почта"
          placeholder="you@example.com"
        />
        <Input
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signUpData.password}
          label="Пароль"
          placeholder="Минимум 8 символов"
        />
        <Input
          name="phone"
          type="tel"
          required
          onChange={inputHandler}
          value={signUpData.phone}
          label="Телефон"
          placeholder="+7 (999) 999-99-99"
        />
      </div>
      <Button type="submit" fullWidth>
        Зарегистрироваться
      </Button>
    </form>
  );
}