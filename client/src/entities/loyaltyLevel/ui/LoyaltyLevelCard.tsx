import React, { useEffect } from "react";
import "./LoyaltyLevelCard.css";
import { create } from "zustand";
import type { UserLoyaltyLevel } from "../model";
import LoyaltyApi from "../api/LoyaltyApi";
import { useUserLoyaltyStore } from "../store/store";
import { Crown } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";

export default function LoyaltyLevelCard() {
  const userLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.userLoyaltyLevel,
  );

  const setUserLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.setUserLoyaltyLevel,
  );

  useEffect(() => {
    async function loadDiscount() {
      const data = await LoyaltyApi.getUserDiscount();
      setUserLoyaltyLevel(data.data);
    }
    loadDiscount();
  }, []);

  const userState = useAppSelector((state) => state.user);
  const user = userState?.user;

  // Mock data for when userLoyaltyLevel is not available yet
  if (!userLoyaltyLevel) {
    return (
      <div className="loyalty-card-skeleton">
        <div className="loyalty-card-shimmer" />
      </div>
    );
  }

  const currentSpending = user?.totalSpent || 0; //вычисляю, сколько потрятил мой юзер
  const nextLevelTarget = 136500; // This should come from loyalty level config
  const toNextLevel = nextLevelTarget - currentSpending;
  const progress = (currentSpending / nextLevelTarget) * 100;

  return (
    <div className="loyalty-card">
      <div className="loyalty-card-header">
        <div className="loyalty-card-title-section">
          <div className="loyalty-card-title-wrapper">
            <Crown className="loyalty-card-crown" />
            <span className="loyalty-card-status-label">Ваш статус</span>
          </div>
          <h2 className="loyalty-card-level">
            {userLoyaltyLevel.level || "PLATINUM"}
          </h2>
          <p className="loyalty-card-discount-info">
            Индивидуальная скидка:{" "}
            <span className="loyalty-card-discount-value">
              {userLoyaltyLevel.discount_pct}%
            </span>
          </p>
        </div>
        <div className="loyalty-card-discount-badge">
          <div className="loyalty-card-discount-badge-text">
            {userLoyaltyLevel.min_spent}%
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="loyalty-card-progress-section">
        <div className="loyalty-card-progress-header">
          <span className="loyalty-card-progress-label">
            До следующего уровня
          </span>
          <span className="loyalty-card-progress-value">
            {toNextLevel.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {/* Progress Bar */}
        <Progress.Root className="loyalty-card-progress-root" value={progress}>
          <Progress.Indicator
            className="loyalty-card-progress-indicator"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>

        <div className="loyalty-card-progress-range">
          <span>{currentSpending.toLocaleString("ru-RU")} ₽</span>
          <span>{nextLevelTarget.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>

      {/* Next Level Info */}
      <div className="loyalty-card-next-level">
        <p className="loyalty-card-next-level-text">
          Следующий уровень:{" "}
          <span className="loyalty-card-next-level-name">Diamond</span> •
          Скидка: <span className="loyalty-card-next-level-discount">15%</span>
        </p>
      </div>
    </div>
  );
}
