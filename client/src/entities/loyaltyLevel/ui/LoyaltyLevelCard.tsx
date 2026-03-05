import React, { useEffect, useState } from "react";
import "./LoyaltyLevelCard.css";
import type { LoyaltyLevel } from "../model";
import LoyaltyApi from "../api/LoyaltyApi";
import { useUserLoyaltyStore } from "../store/store";
import { Crown } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  getNextLevel,
  getProgress,
  getRemainingToNext,
} from "../lib/loyaltyHelpers";

export default function LoyaltyLevelCard() {
  const [levels, setLevels] = useState<LoyaltyLevel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.userLoyaltyLevel,
  );

  const setUserLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.setUserLoyaltyLevel,
  );

  useEffect(() => {
    async function loadLoyaltyData() {
      try {
        const [userDiscountResponse, loyaltyLevels] = await Promise.all([
          LoyaltyApi.getUserDiscount(),
          LoyaltyApi.getLoyaltyLevels(),
        ]);

        setUserLoyaltyLevel(userDiscountResponse.data);
        if (Array.isArray(loyaltyLevels) && loyaltyLevels.length > 0) {
          const sortedLevels = [...loyaltyLevels].sort(
            (a, b) => a.min_spent - b.min_spent,
          );
          setLevels(sortedLevels);
        } else {
          setLevels(null);
        }
      } catch (error) {
        // В продакшене можно добавить отдельный трекинг ошибок
        console.error("Failed to load loyalty data", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLoyaltyData();
  }, [setUserLoyaltyLevel]);

  const userState = useAppSelector((state) => state.user);
  const user = userState?.user;

  // Skeleton для состояния загрузки
  if (isLoading && !userLoyaltyLevel) {
    return (
      <div className="loyalty-card-skeleton">
        <div className="loyalty-card-shimmer" />
      </div>
    );
  }

  // Если загрузка закончилась, но данных нет — показываем аккуратный плейсхолдер
  if (!userLoyaltyLevel) {
    return (
      <div className="loyalty-card empty-state">
        <div className="loyalty-card-header">
          <div className="loyalty-card-title-section">
            <div className="loyalty-card-title-wrapper">
              <Crown className="loyalty-card-crown" />
              <span className="loyalty-card-status-label">Ваш статус</span>
            </div>
            <h2 className="loyalty-card-level">Нет данных</h2>
            <p className="loyalty-card-discount-info">
              Информация о программе лояльности временно недоступна.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentSpending = user?.totalSpent || 0;

  const hasLevels = Array.isArray(levels) && levels.length > 0;

  const currentLevel = hasLevels
    ? // определяем текущий уровень по суммарным тратам
      [...levels].reverse().find((level) => currentSpending >= level.min_spent)
    : undefined;

  const rawProgress = hasLevels
    ? getProgress(levels, currentSpending)
    : 0;
  const progress = Math.max(0, Math.min(100, rawProgress));
  const toNextLevel = hasLevels
    ? getRemainingToNext(levels, currentSpending)
    : 0;
  const nextLevel = hasLevels
    ? getNextLevel(levels, currentSpending)
    : undefined;

  const nextLevelTarget =
    hasLevels && nextLevel?.min_spent
      ? nextLevel.min_spent
      : currentSpending || 1;

  return (
    <div className="loyalty-card">
      <div className="loyalty-card-header">
        <div className="loyalty-card-title-section">
          <div className="loyalty-card-title-wrapper">
            <Crown className="loyalty-card-crown" />
            <span className="loyalty-card-status-label">Ваш статус</span>
          </div>
          <h2 className="loyalty-card-level">
            {currentLevel?.level || userLoyaltyLevel.level || "Без уровня"}
          </h2>
          <p className="loyalty-card-discount-info">
            Индивидуальная скидка:{" "}
            <span className="loyalty-card-discount-value">
              {(currentLevel?.discount_pct ??
                userLoyaltyLevel.discount_pct) || 0}
            </span>
          </p>
        </div>
        <div className="loyalty-card-discount-badge">
          <div className="loyalty-card-discount-badge-text">
            {(currentLevel?.discount_pct ?? userLoyaltyLevel.discount_pct) || 0}%
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
            {hasLevels && nextLevel
              ? toNextLevel.toLocaleString("ru-RU")
              : "—"} ₽
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
          {!hasLevels ? (
            <>
              Информация о следующих уровнях появится позже.
            </>
          ) : nextLevel ? (
            <>
              Следующий уровень:{" "}
              <span className="loyalty-card-next-level-name">
                {nextLevel.level}
              </span>{" "}
              • Скидка:{" "}
              <span className="loyalty-card-next-level-discount">
                {nextLevel.discount_pct}%
              </span>
            </>
          ) : (
            <>
              Вы на максимальном уровне программы лояльности. Текущая скидка:{" "}
              <span className="loyalty-card-next-level-discount">
                {(currentLevel?.discount_pct ??
                  userLoyaltyLevel.discount_pct) || 0}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}