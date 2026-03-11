import { axiosInstance } from "../../../shared/lib/axiosInstance";
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
        data: {} as MeasurementType,
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
        data: {} as MeasurementType,
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
        data: {} as MeasurementType,
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
}
