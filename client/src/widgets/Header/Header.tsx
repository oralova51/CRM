import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import "./Header.css";
import { signOutThunk } from "../../entities/user/api/UserApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { Button } from "@/shared/ui/Button/Button";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";

const NAV_ITEMS = [
  { to: "/", label: "Дашборд" },
  { to: "/bookings", label: "Запись на процедуру" },
  { to: "/procedures", label: "Календарь посещений" },
  { to: "/ai", label: "Виртуальный ассистент" },
];

export default function Header() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Функция-обработчик для защищенных ссылок
  const handleProtectedNavigation = (e: React.MouseEvent, to: string) => {
    if (!user) {
      e.preventDefault(); // Предотвращаем переход
      navigate(CLIENT_ROUTES.AUTH); // Отправляем на авторизацию
    }
    // Если пользователь авторизован - переход произойдет normally
  };

  async function handleSignOut() {
    await dispatch(signOutThunk());
  }

  return (
    <header className="shell-header">
      <div className="shell-brand">
        <span className="shell-brand-title">CRM Studio</span>
        <span className="shell-brand-subtitle">Рабочее пространство</span>
      </div>

      {/* Десктопная навигация */}
      {!isMobile && (
        <>
          <nav className="shell-nav-desktop">
            {NAV_ITEMS.map((item) => {
              // Для дашборда не нужна защита (доступен всем)
              if (item.to === "/") {
                return (
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
                );
              }
              
              // Для остальных пунктов - с обработчиком
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    ["shell-nav-link", isActive && "shell-nav-link--active"]
                      .filter(Boolean)
                      .join(" ")
                  }
                  onClick={(e) => handleProtectedNavigation(e, item.to)}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          
          <nav className="shell-nav-desktop">
            {user ? (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  ["shell-nav-link", isActive && "shell-nav-link--active"]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                {user.name}
              </NavLink>
            ) : (
              <span className="shell-guest">Гость</span>
            )}
          </nav>

          <div className="shell-user">
            {user ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
              >
                Выйти
              </Button>
            ) : (
              <NavLink to="/auth" className="shell-auth-link">
                Войти
              </NavLink>
            )}
          </div>
        </>
      )}

      {/* Мобильная версия */}
      {isMobile && (
        <div className="shell-mobile">
          <button 
            className="shell-burger-button" 
            onClick={toggleMenu}
          >
            <span className="burger-icon">☰</span>
          </button>

          {isMenuOpen && (
            <div className="shell-dropdown-menu">
              {NAV_ITEMS.map((item) => {
                // Дашборд без защиты
                if (item.to === "/") {
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className="shell-dropdown-item"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </NavLink>
                  );
                }
                
                // Остальные пункты с защитой
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="shell-dropdown-item"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        navigate(CLIENT_ROUTES.AUTH);
                        closeMenu();
                      } else {
                        closeMenu();
                      }
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
              
              {user && (
                <NavLink
                  to="/profile"
                  className="shell-dropdown-item"
                  onClick={closeMenu}
                >
                  👤 {user.name}
                </NavLink>
              )}
              
              <div className="dropdown-divider"></div>
              
              {user ? (
                <button
                  className="shell-dropdown-item dropdown-button"
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                >
                  Выйти
                </button>
              ) : (
                <NavLink
                  to="/auth"
                  className="shell-dropdown-item"
                  onClick={closeMenu}
                >
                  Войти
                </NavLink>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}