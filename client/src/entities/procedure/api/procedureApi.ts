import { axiosInstance } from "@/shared/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ServerResponseType } from "@/shared/types";
import type { Procedure } from "../model/types";
import { AxiosError } from "axios";

const PROCEDURE_THUNK_NAMES = {
  GET_ALL: "procedure/getAll",
  GET_ONE: "procedure/getOne",
  CREATE: "procedure/create",
  UPDATE: "procedure/update",
  DELETE: "procedure/delete",
} as const;

const PROCEDURE_API_URL = {
  GET_ALL: "/procedures",
  GET_ONE: (id: number) => `/procedures/${id}`,
  CREATE: "/procedures",
  UPDATE: (id: number) => `/procedures/${id}`,
  DELETE: (id: number) => `/procedures/${id}`,
} as const;

// Получить все процедуры
export const getAllProceduresThunk = createAsyncThunk<
  Procedure[],
  void,
  { rejectValue: string }
>(PROCEDURE_THUNK_NAMES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Procedure[]>>(
      PROCEDURE_API_URL.GET_ALL,
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении процедур");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении процедур",
      );
    }
    return rejectWithValue("Ошибка при получении процедур");
  }
});

// Получить одну процедуру
export const getOneProcedureThunk = createAsyncThunk<
  Procedure,
  number,
  { rejectValue: string }
>(PROCEDURE_THUNK_NAMES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get<ServerResponseType<Procedure>>(
      PROCEDURE_API_URL.GET_ONE(id),
    );

    if (data.statusCode === 200 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при получении процедуры");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при получении процедуры",
      );
    }
    return rejectWithValue("Ошибка при получении процедуры");
  }
});

export const createProcedureThunk = createAsyncThunk<
  Procedure,
  Omit<Procedure, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>(PROCEDURE_THUNK_NAMES.CREATE, async (procedureData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ServerResponseType<Procedure>>(
      PROCEDURE_API_URL.CREATE,
      procedureData,
    );

    if (data.statusCode === 201 && data.data) {
      return data.data;
    }
    return rejectWithValue("Ошибка при создании процедуры");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при создании процедуры",
      );
    }
    return rejectWithValue("Ошибка при создании процедуры");
  }
});

// Обновить процедуру (только admin)
export const updateProcedureThunk = createAsyncThunk<
  Procedure,
  { id: number; data: Partial<Procedure> },
  { rejectValue: string }
>(PROCEDURE_THUNK_NAMES.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<Procedure>>(
      PROCEDURE_API_URL.UPDATE(id),
      data,
    );

    if (response.data.statusCode === 200 && response.data.data) {
      return response.data.data;
    }
    return rejectWithValue("Ошибка при обновлении процедуры");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при обновлении процедуры",
      );
    }
    return rejectWithValue("Ошибка при обновлении процедуры");
  }
});

// Удалить процедуру (только admin)
export const deleteProcedureThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(PROCEDURE_THUNK_NAMES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ServerResponseType<null>>(
      PROCEDURE_API_URL.DELETE(id),
    );

    if (response.data.statusCode === 200) {
      return id; // возвращаем id удаленной процедуры
    }
    return rejectWithValue("Ошибка при удалении процедуры");
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data?.message || "Ошибка при удалении процедуры",
      );
    }
    return rejectWithValue("Ошибка при удалении процедуры");
  }
});
