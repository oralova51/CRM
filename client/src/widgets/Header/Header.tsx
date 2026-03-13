import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarPlus, // для записи
  CalendarDays,
  History,
  MessageCircle,
  Info,
  Menu,
  X,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { signOutThunk } from "@/entities/user/api/UserApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard, protected: true },
  { to: "/promo", label: "О студии", icon: Info, protected: false },  // новый пункт
  { to: "/book", label: "Запись", icon: CalendarPlus, protected: true },
  {
    to: "/procedures",
    label: "Календарь",
    icon: CalendarDays,
    protected: true,
  },
  { to: "/history", label: "История", icon: History, protected: true },
  { to: "/ai", label: "AI ассистент", icon: MessageCircle, protected: true },
];

export function Header() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      if (window.innerWidth >= 800) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await dispatch(signOutThunk());
    navigate(CLIENT_ROUTES.AUTH);
  };

  const handleProtectedNavigation = (e: React.MouseEvent, to: string) => {
    if (!user) {
      e.preventDefault();
      navigate(CLIENT_ROUTES.AUTH);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // На десктопе показываем боковую панель
  if (!isMobile) {
    return (
      <>
        {/* Боковая панель */}
        <aside className={styles.desktopSidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <img
                className={styles.logoTitle}
                src="./logo.svg"
                alt="logo"
              ></img>
              <span className={styles.logoSubtitle}>
                Студия идеального тела
              </span>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              // Если пункт не защищён (landing) - доступен всем
              if (!item.protected) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                    }
                    end={item.to === "/"}
                  >
                    <Icon className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </NavLink>
                );
              }

              // Защищённые пункты - только для авторизованных
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive && user ? styles.navItemActive : ""} ${
                      !user ? styles.navItemDisabled : ""
                    }`
                  }
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      navigate(CLIENT_ROUTES.AUTH);
                    }
                  }}
                >
                  <Icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Блок пользователя внизу */}
          <div className={styles.sidebarUser}>
            {user ? (
              <>
                {/* Оборачиваем ТОЛЬКО userInfo в кликабельный div */}
                <div
                  className={styles.userInfo}
                  onClick={() => {
                    if (user.role === "isAdmin") {
                      navigate("/admin");
                    } else {
                      navigate("/profile");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.userAvatar}>
                    <User className={styles.userIcon} />
                  </div>
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>{user.name}</span>
                    <span className={styles.userRole}>
                      {user.role === "isAdmin" ? "Администратор" : "Клиент"}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.signOutButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    handleSignOut();
                  }}
                >
                  <LogOut className={styles.signOutIcon} />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <NavLink to="/auth" className={styles.signInLink}>
                <LogIn className={styles.signInIcon} />
                <span>Войти</span>
              </NavLink>
            )}
          </div>
        </aside>

        {/* Маленький хедер для десктопа (только бренд) */}
        <header className={styles.desktopHeader}>
          <div className={styles.desktopHeaderContent}>
            <span className={styles.desktopHeaderTitle}>
              Студия идеального тела
            </span>
          </div>
        </header>
      </>
    );
  }

  // Мобильная версия
  return (
    <header className={styles.mobileHeader}>
      <div className={styles.mobileHeaderContent}>
        <div className={styles.mobileLogo}>
          <img
            className={styles.mobileLogoTitle}
            src="./logo.svg"
            alt="logo"
          ></img>
        </div>
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              if (item.to === "/") {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={styles.mobileNavIcon} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""} ${
                      !user ? styles.mobileNavItemDisabled : ""
                    }`
                  }
                  onClick={(e) => {
                    handleProtectedNavigation(e, item.to);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className={styles.mobileNavIcon} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className={styles.mobileUser}>
            {user ? (
              <>
                <div
                  className={styles.mobileUserInfo}
                  onClick={() => {
                    if (user.role === "isAdmin") {
                      navigate("/admin");
                    } else {
                      navigate("/profile"); // или другой роут для профиля клиента
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className={styles.mobileUserName}>{user.name}</span>
                  <span className={styles.mobileUserRole}>
                    {user.role === "isAdmin" ? "Администратор" : "Клиент"}
                  </span>
                </div>
                <button
                  className={styles.mobileSignOutButton}
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut />
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className={styles.mobileSignInLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn />
                <span>Войти</span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
