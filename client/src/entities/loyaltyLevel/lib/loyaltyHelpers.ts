import type { LoyaltyLevel } from "@/entities/loyaltyLevel/model";
import OrderApi from "@/entities/order/api/OrderApi";

export type EconomicBenefits = {
  discountsReceived: number;
  savedPercentage: number;
};
export function getCurrentLevel(levels: LoyaltyLevel[], totalSpent:number) {
  return [...levels]
    .reverse()
    .find((level) => totalSpent >= level.min_spent)
}

export function getNextLevel(levels: LoyaltyLevel[], totalSpent:number) {
  return levels.find((level) => totalSpent < level.min_spent)
}

export function getRemainingToNext(levels: LoyaltyLevel[], totalSpent:number) {
  const next = getNextLevel(levels, totalSpent)

  if (!next) return 0

  return next.min_spent - totalSpent
}

export function getProgress(levels: LoyaltyLevel[], totalSpent:number) {
  const current = getCurrentLevel(levels, totalSpent)
  const next = getNextLevel(levels, totalSpent)

  if (!next) return 100

// loyaltyHelpers.ts
const prevTarget = Number(current?.min_spent ?? 0)
const nextTarget = Number(next.min_spent)

  return ((totalSpent - prevTarget) / (nextTarget - prevTarget)) * 100
}

export async function getEconomicBenefits(userId: number): Promise<EconomicBenefits> {
  const response = await OrderApi.getOrdersByUserId(userId);
  const orders = response.data ?? [];

  const totalOriginal = orders.reduce((sum, order) => sum + Number(order.price), 0);
  const totalFinal = orders.reduce((sum, order) => sum + Number(order.final_price), 0);

  const discountsReceived = totalOriginal - totalFinal;
  const savedPercentage =
    totalOriginal > 0
      ? Number(((discountsReceived / totalOriginal) * 100).toFixed(1))
      : 0;

  return { discountsReceived, savedPercentage };
}