import { Routes, Route } from "react-router";
import Layout from "../Layout/Layout";
import AuthPage from "../../pages/AuthPage/AuthPage";
import MainPage from "../../pages/MainPage/MainPage";
// import TasksPage from "../../pages/TasksPage/TasksPage";
import AdminPage from "@/pages/AdminPage/AdminPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={CLIENT_ROUTES.MAIN_PAGE} element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path={CLIENT_ROUTES.AUTH.slice(1)} element={<AuthPage />} />
        <Route path={CLIENT_ROUTES.PROFILE_PAGE} element={<ProfilePage />} />
        <Route path={CLIENT_ROUTES.ADMIN_PAGE} element={<AdminPage  />} />
        <Route path="*" element={<h1>Нет контента</h1>} />
        {/* <Route path={CLIENT_ROUTES.TASKS.slice(1)} element={<TasksPage />} /> */}
      </Route>
    </Routes>
  );
}
