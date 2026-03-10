import { create } from "zustand";
import type { LoyaltyLevel } from "@/entities/loyaltyLevel/model";

type UserLoyaltyStore = {
  userLoyaltyLevel: LoyaltyLevel | null;
  setUserLoyaltyLevel: (userLoyaltyLevel: LoyaltyLevel | null) => void;
};

export const useUserLoyaltyStore = create<UserLoyaltyStore>((set) => ({
  userLoyaltyLevel: null,
  setUserLoyaltyLevel: (userLoyaltyLevel) =>
    set({ userLoyaltyLevel }),
}));

