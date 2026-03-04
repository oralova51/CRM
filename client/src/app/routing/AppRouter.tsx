import { Routes, Route } from "react-router";
import Layout from "../Layout/Layout";
import AuthPage from "../../pages/AuthPage/AuthPage";
import MainPage from "../../pages/MainPage/MainPage";
import TasksPage from "../../pages/TasksPage/TasksPage";
import { CLIENT_ROUTES } from "../../shared/consts/clientRoutes";


export default function AppRouter() {
  return (
    <Routes>
      <Route
        path={CLIENT_ROUTES.MAIN_PAGE}
        element={<Layout />}
      >
        <Route index element={<MainPage />} />
        <Route
          path={CLIENT_ROUTES.AUTH.slice(1)}
          element={<AuthPage  />}
        />
        <Route path={CLIENT_ROUTES.TASKS.slice(1)} element={<TasksPage />} />
        <Route path="*" element={<h1>Нет контента</h1>} />
      </Route>
    </Routes>
  );
}
