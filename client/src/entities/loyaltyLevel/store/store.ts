import { create } from "zustand";
import type { UserLoyaltyData } from "@/entities/loyaltyLevel/model";

type UserLoyaltyStore = {
  userLoyaltyLevel: UserLoyaltyData | null;
  setUserLoyaltyLevel: (userLoyaltyLevel: UserLoyaltyData | null) => void;
};

export const useUserLoyaltyStore = create<UserLoyaltyStore>((set) => ({
  userLoyaltyLevel: null,
  setUserLoyaltyLevel: (userLoyaltyLevel) =>
    set({ userLoyaltyLevel }),
}));