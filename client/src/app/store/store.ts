import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/entities/user/slice/userSlice";
import { measurementReducer } from "@/entities/measurement/slice/measurementSlice";

export const store = configureStore({
  reducer: { user: userReducer, measurements: measurementReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
