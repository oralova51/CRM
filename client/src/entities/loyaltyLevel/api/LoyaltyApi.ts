import { axiosInstance } from "../../../shared/lib/axiosInstance";

import type {
  LoyaltyLevel,
  UserLoyaltyLevel,
  ServerResponseType,
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
}
