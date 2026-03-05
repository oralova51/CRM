import { axiosInstance } from "../../../shared/lib/axiosInstance";

import type {
  LoyaltyLevel,
  UserLoyaltyData,
  UserLoyaltyLevel,
  ServerResponseType,
} from "@/entities/loyaltyLevel/model";

export default class LoyaltyApi {
  static async getUserDiscount(): Promise<UserLoyaltyData> {
    const response =
      await axiosInstance.get<UserLoyaltyLevel>("/loyalty/status");
    return response.data.data;
  }

  static async getLoyaltyLevels(): Promise<LoyaltyLevel[]> {
    const response =
      await axiosInstance.get<ServerResponseType<LoyaltyLevel[]>>(
        "/loyalty/levels",
      );

    return response.data.data;
  }
}
