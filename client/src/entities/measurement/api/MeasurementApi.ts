import { createAsyncThunk } from "@reduxjs/toolkit";
import { MeasurementInputData, MeasurementType } from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { ServerResponseType } from "@/shared/types";
import { AxiosError } from "axios";

const MEASUREMENT_THUNK_NAMES = {
  GET_BY_USER: "/getByUser",
  CREATE: "create",
  UPDATE: "/update",
  DELETE: "/delete",
  GET_BY_ID: "/getById",
} as const;

const MEASUREMENT_API_URL = {
  BY_USER: "/measurement/byUser",
  CREATE: "/measurement/",
  UPDATE: (id: number) => `/measurement/${id}`,
  DELETE: (id: number) => `/measurement/${id}`,
  BY_ID: (id: number) => `/measurement/${id}`,
};

export const getMeasurementThunk = createAsyncThunk<
  MeasurementType[],
  void,
  { rejectValue: string }
>(MEASUREMENT_THUNK_NAMES.GET_BY_USER, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
      ServerResponseType<MeasurementType[]>
    >(MEASUREMENT_API_URL.BY_USER);
    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении данных");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении данных",
      );
    }
    return rejectWithValue("Ошибка при получении данных");
  }
});

export const getMeasurementByIdThunk = createAsyncThunk<
  MeasurementType,
  number,
  { rejectValue: string }
>(MEASUREMENT_THUNK_NAMES.GET_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<
      ServerResponseType<MeasurementType>
    >(MEASUREMENT_API_URL.BY_ID(id));
    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении данных");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении данных",
      );
    }
    return rejectWithValue("Ошибка при получении данных");
  }
});
export const createMeasurementThunk = createAsyncThunk<
  MeasurementType,
  MeasurementInputData,
  { rejectValue: string }
>(
  MEASUREMENT_THUNK_NAMES.CREATE,
  async (measurementData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<
        ServerResponseType<MeasurementType>
      >(MEASUREMENT_API_URL.CREATE, measurementData);
      if (data.statusCode === 201 && data.data) {
        return data.data;
      }
      return rejectWithValue("Ошибка при cоздании данных");
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка при cоздании данных",
        );
      }
      return rejectWithValue("Ошибка при cоздании данных");
    }
  },
);

export const updateMeasurementThunk = createAsyncThunk<
  MeasurementType,
  MeasurementInputData,
  { rejectValue: string }
>(
  MEASUREMENT_THUNK_NAMES.UPDATE,
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put<
        ServerResponseType<MeasurementType>
      >(MEASUREMENT_API_URL.UPDATE(id), updateData);
      if (data.statusCode === 200 && data.data) {
        return data.data;
      }
      return rejectWithValue("Ошибка при обновлении данных");
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Ошибка при обновлении данных",
        );
      }
      return rejectWithValue("Ошибка при обновлении данных");
    }
  },
);

export const deleteMeasurementThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(MEASUREMENT_THUNK_NAMES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete<ServerResponseType<null>>(
      MEASUREMENT_API_URL.DELETE(id),
    );

    if (data.statusCode === 200) {
      return id;
    }
    return rejectWithValue("Ошибка при удалении замера");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при удалении замера",
      );
    }
    return rejectWithValue("Ошибка при удалении замера");
  }
});
