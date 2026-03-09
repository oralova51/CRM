import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { userReducer } from "@/entities/user/slice/userSlice";
import { procedureReducer } from "@/entities/procedure/slice/procedureSlice";
import { bookingReducer } from "@/entities/booking/slice/bookingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    procedures: procedureReducer,
    bookings: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Создаем типизированные хуки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;