import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Calendar, History, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Дашборд" },
  { path: "/book", icon: Calendar, label: "Запись" },
  { path: "/procedures", icon: Calendar, label: "Календарь" },
  { path: "/history", icon: History, label: "История" },
  { path: "/ai", icon: MessageCircle, label: "AI" },
];

export function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:block bg-white border-r border-neutral-200">
        <div className="p-6">
          <div className="text-2xl font-light text-neutral-900">
            Ideal Body<br />
            <span className="text-sm text-neutral-600">Studio</span>
          </div>
        </div>
        <nav className="px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-lg font-light text-neutral-900">
            Ideal Body <span className="text-xs text-neutral-600">Studio</span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <nav className="border-t border-neutral-200 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-100 ${
                    isActive ? "bg-neutral-50 text-neutral-900" : "text-neutral-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 ${
                  isActive ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="lg:ml-64 bg-white border-t border-neutral-200 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-600">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Контакты</h3>
              <p>+7 (XXX) XXX-XX-XX</p>
              <p>info@idealbody.studio</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Поддержка</h3>
              <p>support@idealbody.studio</p>
            </div>
            <div>
              <Link to="#" className="block hover:text-neutral-900">Политика конфиденциальности</Link>
              <p className="mt-2">© 2026 Ideal Body Studio</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}