import { configureStore } from "@reduxjs/toolkit";
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
