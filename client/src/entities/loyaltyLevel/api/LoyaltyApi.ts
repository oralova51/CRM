import { axiosInstance } from "../../../shared/lib/axiosInstance";

import type {
  LoyaltyLevel,
  UserLoyaltyLevel,
  ServerResponseType,
  BookingApiItem
} from "@/entities/loyaltyLevel/model";

export default class LoyaltyApi {
  static async getUserDiscount(): Promise<ServerResponseType<LoyaltyLevel>> {
    const response = await axiosInstance.get<ServerResponseType<LoyaltyLevel>>("/loyalty/status");
    const data = response.data;
    return data;
  }

  static async getLoyaltyLevels(): Promise<LoyaltyLevel[]> {
    const response = await axiosInstance.get<
      ServerResponseType<{ loyaltyLevels: LoyaltyLevel[] }>
    >("/loyalty/levels");

    // Сервер оборачивает массив в { loyaltyLevels: [...] }
    return response.data.data?.loyaltyLevels ?? [];
  }

  static async getStatistics(): Promise<ServerResponseType<BookingApiItem[]>> {
    const response = await axiosInstance.get<ServerResponseType<BookingApiItem[]>>("/bookings/my/past");
    return response.data;
  }
}
