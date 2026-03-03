import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import "./SignUpForm.css";
import { UserValidator } from "../../../../entities/user/model/UserValidator";

import { setAccessToken } from "../../../../shared/lib/axiosInstance";
import FormInput from "../../../../shared/ui/FormInput/FormInput";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { signUpThunk } from "@/entities/user/api/UserApi";



export default function SignUpForm() {
  const initialValue = { username: "", email: "", password: "" };
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [signUpData, setSignUpData] = useState(initialValue);

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
      alert(validationError);
      return;
    }
    await dispatch(signUpThunk(signUpData));
    navigate("/");
  };

  return (
    <div>
      <form className="form" onSubmit={signUpHandler}>
        <FormInput
          placeholder=" "
          name="username"
          type="text"
          required
          onChange={inputHandler}
          value={signUpData.username}
          label="Имя"
        />
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signUpData.email}
          label="Почта"
        />
        <FormInput
          placeholder=" "
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signUpData.password}
          label="Пароль"
        />
        <button className="form-action-button">Зарегистрироваться</button>
      </form>
    </div>
  );
}
