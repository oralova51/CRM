import { NavLink } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import "./Header.css";
// import UserApi from "../../entities/user/api/UserApi";
// import { setAccessToken } from "../../shared/lib/axiosInstance";
// import type { User } from "../../entities/user/model";
import { signOutThunk } from "../../entities/user/api/UserApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";


export default function Header() {
  const userState = useAppSelector((state) => state.user);
  const { user } = userState;
  const dispatch = useAppDispatch();

  async function handleSignOut() {
    await dispatch(signOutThunk())
  }

  return (
    <header>
      <nav>
        <NavLink to="/" className="navlink">
          Главная
        </NavLink>
        <NavLink to="/tasks" className="navlink">
          Задачи
        </NavLink>

        {user ? (
          <>
            <p>{user.username}</p>
            <NavLink to="/auth" className="navlink" onClick={handleSignOut}>
              Выход
            </NavLink>
          </>
        ) : (
          <NavLink to="/auth" className="navlink">
            Вход
          </NavLink>
        )}
      </nav>
    </header>
  );
}
