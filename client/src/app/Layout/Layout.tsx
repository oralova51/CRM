import { Outlet, Link } from "react-router";
import Header from "@/widgets/Header/Header";
import "./Layout.css";
import "./Footer.css";

export default function Layout() {
  return (
    <div className="shell">
      <Header />
      <main className="shell-main">
        <Outlet />
      </main>
      <footer className="shell-footer">
        <div className="shell-footer-inner">
          <div className="shell-footer-grid">
            <div className="shell-footer-col">
              <h3 className="shell-footer-heading">Контакты</h3>
              <p>+7 (XXX) XXX-XX-XX</p>
              <p>info@idealbody.studio</p>
            </div>
            <div className="shell-footer-col">
              <h3 className="shell-footer-heading">Поддержка</h3>
              <p>support@idealbody.studio</p>
            </div>
            <div className="shell-footer-col">
              <Link to="#" className="shell-footer-link">
                Политика конфиденциальности
              </Link>
              <p className="shell-footer-copy">© 2026 Ideal Body Studio</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
