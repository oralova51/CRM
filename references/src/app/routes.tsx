import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { BookAppointment } from "./components/BookAppointment";
import { ProcedureCalendar } from "./components/ProcedureCalendar";
import { VisitHistory } from "./components/VisitHistory";
import { AIChat } from "./components/AIChat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "book", element: <BookAppointment /> },
      { path: "procedures", element: <ProcedureCalendar /> },
      { path: "history", element: <VisitHistory /> },
      { path: "ai", element: <AIChat /> },
    ],
  },
]);
