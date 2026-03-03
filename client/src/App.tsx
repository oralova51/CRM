import { useEffect } from "react";
import AppRouter from "./app/routing/AppRouter";
import { refreshThunk } from "@/entities/user/api/UserApi";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";

function App() {
  // const [user, setUser] = useState<User | null>(null);

  // async function refreshUser() {
  //   const { data, statusCode }: AuthResponse = await UserApi.refresh();

  //   if (statusCode === 200) {
  //     setUser(data.user);
  //   }
  // }

  // useEffect(() => {
  //   void refreshUser();
  // }, []);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshThunk());
  }, []);

  return <AppRouter />;
}

export default App;
