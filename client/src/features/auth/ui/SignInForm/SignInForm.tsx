import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import "./SignInForm.css";
import { UserValidator } from "../../../../entities/user/model/UserValidator";
import FormInput from "../../../../shared/ui/FormInput/FormInput";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { signInThunk } from "@/entities/user/api/UserApi";


export default function SignInForm() {
  const initialValue = { email: "", password: "" };
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [signInData, setSignInData] = useState(initialValue);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const signInHandler = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, error: validationError } =
      UserValidator.validateSignInData(signInData);

    if (!isValid) {
      alert(validationError);
      return;
    }
    await dispatch(signInThunk(signInData));
    navigate("/");
  };

  return (
    <div>
      <form className="form" onSubmit={signInHandler}>
        <FormInput
          placeholder=" "
          name="email"
          type="email"
          required
          onChange={inputHandler}
          value={signInData.email}
          label="Почта"
        />
        <FormInput
          placeholder=" "
          name="password"
          type="password"
          required
          onChange={inputHandler}
          value={signInData.password}
          label="Пароль"
        />
        <button className="form-action-button">Войти</button>
      </form>
    </div>
  );
}
