import { axiosInstance } from "@/shared/lib/axiosInstance";
import type {
  Order,
  OrderResponse,
  OrderDeleteResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderApiData,
} from "../model";
import type { ServerResponseType } from "@/shared/types";

const ORDER_BASE = "/order";

function toOrderResponse(
  raw: ServerResponseType<OrderApiData>,
): OrderResponse {
  return {
    statusCode: raw.statusCode,
    message: raw.message,
    data: raw.data?.order ?? null,
    error: raw.error,
  };
}

export default class OrderApi {
  static async createOrder(body: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.post<
        ServerResponseType<OrderApiData>
      >(ORDER_BASE, body);
      return toOrderResponse(response.data);
    } catch (error) {
      console.error("OrderApi.createOrder:", error);
      return {
        statusCode: 500,
        message: "Ошибка при создании заказа",
        data: null,
        error: "Ошибка при создании заказа",
      };
    }
  }

  static async getOrderById(id: number): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.get<
        ServerResponseType<OrderApiData>
      >(`${ORDER_BASE}/${id}`);
      return toOrderResponse(response.data);
    } catch (error) {
      console.error("OrderApi.getOrderById:", error);
      return {
        statusCode: 500,
        message: "Ошибка при получении заказа",
        data: null,
        error: "Ошибка при получении заказа",
      };
    }
  }

  static async updateOrder(
    id: number,
    body: UpdateOrderRequest,
  ): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.put<
        ServerResponseType<OrderApiData>
      >(`${ORDER_BASE}/${id}`, body);
      return toOrderResponse(response.data);
    } catch (error) {
      console.error("OrderApi.updateOrder:", error);
      return {
        statusCode: 500,
        message: "Ошибка при обновлении заказа",
        data: null,
        error: "Ошибка при обновлении заказа",
      };
    }
  }

  static async deleteOrder(id: number): Promise<OrderDeleteResponse> {
    try {
      const response = await axiosInstance.delete<ServerResponseType<null>>(
        `${ORDER_BASE}/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("OrderApi.deleteOrder:", error);
      return {
        statusCode: 500,
        message: "Ошибка при удалении заказа",
        data: null,
        error: "Ошибка при удалении заказа",
      };
    }
  }
}
