import { Outlet } from "react-router";
import Header from "@/widgets/Header/Header";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="shell">
      <Header />
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}