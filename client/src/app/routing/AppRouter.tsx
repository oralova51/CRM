import { Routes, Route } from "react-router";
import Layout from "../Layout/Layout";
import AuthPage from "../../pages/AuthPage/AuthPage";
import MainPage from "../../pages/MainPage/MainPage";
import AdminPage from "@/pages/AdminPage/AdminPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import AiPage from "../../pages/AiPage/AiPage";
import ProcedureCalendarPage from "../../pages/ProcedureCalendarPage/ProcedureCalendarPage";
import BookAppointmentPage from "../../pages/BookAppointmentPage/BookAppointmentPage";
import { CLIENT_ROUTES } from "../../shared/consts/clientRoutes";
import PromoPage from "@/pages/PromoPage/PromoPage";
import VisitHistoryPage from "@/pages/VisitHistoryPage/VisitHistoryPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={CLIENT_ROUTES.MAIN_PAGE} element={<Layout />}>
        {/* Главная теперь ведёт на Landing для неавторизованных */}
        <Route index element={<PromoPage />} />
        <Route path={CLIENT_ROUTES.LANDING.slice(1)} element={<LandingPage />} />
        <Route path={CLIENT_ROUTES.AUTH.slice(1)} element={<AuthPage />} />
        <Route path={CLIENT_ROUTES.BOOK.slice(1)} element={<BookAppointmentPage />} />
        <Route path={CLIENT_ROUTES.PROCEDURES.slice(1)} element={<ProcedureCalendarPage />} />
        <Route path={CLIENT_ROUTES.HISTORY.slice(1)} element={<VisitHistoryPage />} />
        <Route path={CLIENT_ROUTES.PROMO.slice(1)} element={<PromoPage />} />
        <Route path={CLIENT_ROUTES.PROFILE_PAGE.slice(1)} element={<ProfilePage />} />
        <Route path={CLIENT_ROUTES.ADMIN_PAGE.slice(1)} element={<AdminPage />} />
        <Route path={CLIENT_ROUTES.AI_PAGE} element={<AiPage />} />
        <Route path="*" element={<h1>Нет контента</h1>} />
      </Route>
    </Routes>
  );
}

