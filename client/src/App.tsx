import { useEffect } from "react";
import AppRouter from "./app/routing/AppRouter";
// import { refreshThunk } from "@/entities/user/api/UserApi";
import { getMeThunk } from "@/entities/user/api/UserApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";

function App() {
  const dispatch = useAppDispatch();
   const { isInitialized, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMeThunk());
  }, []);

  if (!isInitialized) {
    return <div>Загрузка приложения...</div>;
  }

  return <AppRouter />;
}

export default App;
