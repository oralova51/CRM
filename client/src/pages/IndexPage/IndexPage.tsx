import { useAppSelector } from "@/app/store/store";
import MainPage from "../MainPage/MainPage";
import PromoPage from "../PromoPage/PromoPage";

/**
 * Главная страница "/": Дашборд для авторизованных, Promo (О студии) для остальных.
 */
export default function IndexPage() {
  const { user } = useAppSelector((state) => state.user);

  return user ? <MainPage /> : <PromoPage />;
}
