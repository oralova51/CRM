import {
  axiosFileInstance,
  axiosInstance,
} from "../../../shared/lib/axiosInstance";
import type {
  MeasurementType,
  MeasurementInputData,
  MeasurementsListResponse,
  MeasurementResponse,
  CreateMeasurementType,
} from "../model";
import type { ServerResponseType } from "@/shared/types";

export default class MeasurementApi {
  static async AdminGetUsersMeasurements(
    userId: number,
  ): Promise<MeasurementsListResponse> {
    try {
      const response = await axiosInstance.get<
        ServerResponseType<MeasurementType[]>
      >(`/admin/measurements/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при получении замеров пользователя",
        data: [],
        error: "Ошибка при получении замеров пользователя",
      };
    }
  }

  static async getMeasurementsByUser(): Promise<MeasurementsListResponse> {
    try {
      const response = await axiosInstance.get<
        ServerResponseType<MeasurementType[]>
      >("/measurements/byUser");
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при получении замеров",
        data: [],
        error: "Ошибка при получении замеров",
      };
    }
  }

  static async getMeasurement(id: number): Promise<MeasurementResponse> {
    try {
      const response = await axiosInstance.get<
        ServerResponseType<MeasurementType>
      >(`/measurements/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при получении замеров",
        data: null,
        error: "Ошибка при получении замеров",
      };
    }
  }

  static async createMeasurement(
    body: CreateMeasurementType,
  ): Promise<MeasurementResponse> {
    try {
      const response = await axiosInstance.post<
        ServerResponseType<MeasurementType>
      >("/measurements", body);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при создании замеров",
        data: null,
        error: "Ошибка при создании замеров",
      };
    }
  }

  static async updateMeasurement(
    id: number,
    body: CreateMeasurementType,
  ): Promise<MeasurementResponse> {
    try {
      const response = await axiosInstance.put<
        ServerResponseType<MeasurementType>
      >(`/measurements/${id}`, body);
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при обновлении замеров",
        data: null,
        error: "Ошибка при обновлении замеров",
      };
    }
  }

  static async deleteMeasurement(
    id: number,
  ): Promise<ServerResponseType<null>> {
    try {
      const response = await axiosInstance.delete<ServerResponseType<null>>(
        `/measurements/${id}`,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: "Ошибка при удалении замеров",
        data: null,
        error: "Ошибка при удалении замеров",
      };
    }
  }

  static async uploadPhotoBefore(
    id: number,
    file: File,
  ): Promise<MeasurementResponse> {
    try {
      const formData = new FormData();
      formData.append("photo", file); // ← СНАЧАЛА ДОБАВЛЯЕМ ФАЙЛ

      for (let pair of (formData as any).entries()) {
      }

      const response = await axiosFileInstance.post<
        ServerResponseType<MeasurementType>
      >(`/measurements/${id}/photo-before`, formData);

      return response.data;
    } catch (error) {
      console.log("❌ Ошибка при загрузке фото 'до':", error);
      return {
        statusCode: 500,
        message: 'Ошибка при загрузке фото "до"',
        data: null,
        error: 'Ошибка при загрузке фото "до"',
      };
    }
  }

  static async uploadPhotoAfter(
    id: number,
    file: File,
  ): Promise<MeasurementResponse> {
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await axiosFileInstance.post<
        ServerResponseType<MeasurementType>
      >(`/measurements/${id}/photo-after`, formData);
      return response.data;
    } catch (error) {
      console.log("Ошибка при загрузке фото 'после':", error);
      return {
        statusCode: 500,
        message: 'Ошибка при загрузке фото "после"',
        data: null,
        error: 'Ошибка при загрузке фото "после"',
      };
    }
  }

  static async deletePhoto(
    id: number,
    photoType: "before" | "after",
  ): Promise<MeasurementResponse> {
    try {
      const response = await axiosInstance.delete<
        ServerResponseType<MeasurementType>
      >(`/measurements/${id}/photo?photoType=${photoType}`);
      return response.data;
    } catch (error) {
      console.log("Ошибка при удалении фото", error);
      return {
        statusCode: 500,
        message: "Ошибка при удалении фото",
        data: null,
        error: "Ошибка при удалении фото",
      };
    }
  }

  static async createMeasurementWithPhoto(
    formData: FormData,
  ): Promise<MeasurementResponse> {
    try {
      const response = await axiosFileInstance.post<
        ServerResponseType<MeasurementType>
      >("/measurements/with-photo", formData);

      return response.data;
    } catch (error) {
      console.log("❌ Ошибка при создании замера с фото:", error);
      return {
        statusCode: 500,
        message: "Ошибка при создании замера",
        data: null,
        error: "Ошибка при создании замера",
      };
    }
  }
}
