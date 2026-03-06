import type { LoyaltyLevel } from "@/entities/loyaltyLevel/model";
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