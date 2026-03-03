import { NavLink, Outlet } from "react-router";
import "./Layout.css";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { signOutThunk } from "@/entities/user/api/UserApi";
import { Button } from "@/shared/ui/Button/Button";

const NAV_ITEMS = [
  { to: "/", label: "Дашборд" },
  { to: "/bookings", label: "Запись на процедуру" },
  { to: "/procedures", label: "Календарь посещений" },
  { to: "/ai", label: "Виртуальный ассистент" },
];

export default function Layout() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  async function handleSignOut() {
    await dispatch(signOutThunk());
  }

  return (
    <div className="shell">
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
                [
                  "shell-nav-link",
                  isActive && "shell-nav-link--active",
                ]
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
              <span className="shell-user-name">{user.username}</span>
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

      <main className="shell-main">
        <Outlet />
      </main>

      <nav className="shell-nav-mobile">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              ["shell-nav-mobile-item", isActive && "shell-nav-mobile-item--active"]
                .filter(Boolean)
                .join(" ")
            }
            end={item.to === "/"}
          >
            <span className="shell-nav-mobile-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

