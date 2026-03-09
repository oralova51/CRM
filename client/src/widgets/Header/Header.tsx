import { NavLink } from "react-router";
import "./Header.css";
import { signOutThunk } from "../../entities/user/api/UserApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { Button } from "@/shared/ui/Button/Button";

const NAV_ITEMS = [
  { to: "/", label: "Дашборд" },
  { to: "/bookings", label: "Запись на процедуру" },
  { to: "/procedures", label: "Календарь посещений" },
  { to: "/ai", label: "Виртуальный ассистент" },
];

export default function Header() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  async function handleSignOut() {
    await dispatch(signOutThunk());
  }

  return (
    <header className="shell-header">
      <div className="shell-brand">
        <span className="shell-brand-title">CRM Studio</span>
        <span className="shell-brand-subtitle">Рабочее пространство</span>
      </div>

      <nav className="shell-nav-desktop">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              ["shell-nav-link", isActive && "shell-nav-link--active"]
                .filter(Boolean)
                .join(" ")
            }
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="shell-user">
        {user ? (
          <>
            <span className="shell-user-name">
              <NavLink to="/profile">{user.name}</NavLink>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleSignOut}
            >
              Выйти
            </Button>
          </>
        ) : (
          <NavLink to="/auth" className="shell-auth-link">
            Войти
          </NavLink>
        )}
      </div>
    </header>
  );
}
