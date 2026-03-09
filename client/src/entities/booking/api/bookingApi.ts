import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type {
  Booking,
  CreateBookingData,
  UpdateBookingStatusData,
} from "../model/types";
import { AxiosError } from "axios";

const BOOKING_THUNK_NAMES = {
  GET_MY: "booking/getMy",
  GET_MY_UPCOMING: "booking/getMyUpcoming",
  GET_MY_PAST: "booking/getMyPast",
  GET_ALL: "booking/getAll", // для админа
  CREATE: "booking/create",
  UPDATE_STATUS: "booking/updateStatus",
} as const;

const BOOKING_API_URL = {
  GET_MY: "/bookings/my",
  GET_MY_UPCOMING: "/bookings/my/upcoming",
  GET_MY_PAST: "/bookings/my/past",
  GET_ALL: "/bookings",
  CREATE: "/bookings",
  UPDATE_STATUS: (id: number) => `/bookings/${id}/status`,
} as const;

// Получить все записи текущего пользователя
export const getMyBookingsThunk = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>(BOOKING_THUNK_NAMES.GET_MY, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Booking[]>>(
      BOOKING_API_URL.GET_MY,
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении записей");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении записей",
      );
    }
    return rejectWithValue("Ошибка при получении записей");
  }
});

// Получить предстоящие записи
export const getMyUpcomingBookingsThunk = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>(BOOKING_THUNK_NAMES.GET_MY_UPCOMING, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Booking[]>>(
      BOOKING_API_URL.GET_MY_UPCOMING,
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении предстоящих записей");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Ошибка при получении предстоящих записей",
      );
    }
    return rejectWithValue("Ошибка при получении предстоящих записей");
  }
});

// Получить прошедшие записи
export const getMyPastBookingsThunk = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>(BOOKING_THUNK_NAMES.GET_MY_PAST, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Booking[]>>(
      BOOKING_API_URL.GET_MY_PAST,
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении прошедших записей");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Ошибка при получении прошедших записей",
      );
    }
    return rejectWithValue("Ошибка при получении прошедших записей");
  }
});

// Получить все записи (только для админа)
export const getAllBookingsThunk = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>(BOOKING_THUNK_NAMES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Booking[]>>(
      BOOKING_API_URL.GET_ALL,
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении всех записей");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении всех записей",
      );
    }
    return rejectWithValue("Ошибка при получении всех записей");
  }
});

// Создать запись
export const createBookingThunk = createAsyncThunk<
  Booking,
  CreateBookingData,
  { rejectValue: string }
>(BOOKING_THUNK_NAMES.CREATE, async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<Booking>>(
      BOOKING_API_URL.CREATE,
      bookingData,
    );

    if (data.statusCode === 201 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при создании записи");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при создании записи",
      );
    }
    return rejectWithValue("Ошибка при создании записи");
  }
});

// Обновить статус записи (только для админа)
export const updateBookingStatusThunk = createAsyncThunk<
  Booking,
  { id: number; status: UpdateBookingStatusData },
  { rejectValue: string }
>(
  BOOKING_THUNK_NAMES.UPDATE_STATUS,
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put<ServerResponseType<Booking>>(
        BOOKING_API_URL.UPDATE_STATUS(id),
        status,
      );

      if (data.statusCode === 200 && data.data) {
        return data.data;
      }
      return rejectWithValue("Ошибка при обновлении статуса");
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка при обновлении статуса",
        );
      }
      return rejectWithValue("Ошибка при обновлении статуса");
    }
  },
);
