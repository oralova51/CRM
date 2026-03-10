import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialBookingState, type Booking } from "../model/types";
import {
  getMyBookingsThunk,
  getMyUpcomingBookingsThunk,
  getMyPastBookingsThunk,
  getAllBookingsThunk,
  createBookingThunk,
  updateBookingStatusThunk,
} from "../api/bookingApi";

const bookingSlice = createSlice({
  name: "booking",
  initialState: initialBookingState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMyBookings
      .addCase(getMyBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;

        const now = new Date();

        // Предстоящие: статус pending или confirmed И дата в будущем
        state.upcomingBookings = action.payload.filter((booking) => {
          const bookingDate = new Date(booking.scheduled_at);
          return (
            (booking.status === "pending" || booking.status === "confirmed") &&
            bookingDate > now
          );
        });

        // Прошедшие: статус completed или cancelled ИЛИ дата в прошлом
        // (даже если статус остался pending, но время прошло - показываем в истории)
        state.pastBookings = action.payload.filter((booking) => {
          const bookingDate = new Date(booking.scheduled_at);
          return (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            bookingDate <= now
          ); // все записи с прошедшей датой
        });

        console.log("Bookings filtered:", {
          all: action.payload.length,
          upcoming: state.upcomingBookings.length,
          past: state.pastBookings.length,
          now: now.toISOString(),
        });
      })
      .addCase(getMyBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке записей";
      })

      // getMyUpcomingBookings
      .addCase(getMyUpcomingBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyUpcomingBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.upcomingBookings = action.payload;
      })
      .addCase(getMyUpcomingBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "Ошибка при загрузке предстоящих записей";
      })

      // getMyPastBookings
      .addCase(getMyPastBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyPastBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pastBookings = action.payload;
      })
      .addCase(getMyPastBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке прошедших записей";
      })

      // getAllBookings (admin)
      .addCase(getAllBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBookingsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке всех записей";
      })

      // createBooking
      .addCase(createBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);

        // Обновляем списки в зависимости от даты
        const now = new Date();
        if (new Date(action.payload.scheduled_at) > now) {
          state.upcomingBookings.push(action.payload);
        }
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при создании записи";
      })

      // updateBookingStatus
      .addCase(updateBookingStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatusThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        // Обновляем в основном списке
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }

        // Обновляем в upcoming/past списках
        state.upcomingBookings = state.upcomingBookings.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );
        state.pastBookings = state.pastBookings.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        );

        // Если статус изменился на completed/cancelled, перемещаем из upcoming в past
        if (
          action.payload.status === "completed" ||
          action.payload.status === "cancelled"
        ) {
          state.upcomingBookings = state.upcomingBookings.filter(
            (b) => b.id !== action.payload.id,
          );
          if (!state.pastBookings.find((b) => b.id === action.payload.id)) {
            state.pastBookings.push(action.payload);
          }
        }
      })
      .addCase(updateBookingStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при обновлении статуса";
      });
  },
});

export const { setCurrentBooking, clearError } = bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;
