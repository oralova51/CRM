import React, { useEffect, useState } from "react";
import "./LoyaltyLevelCard.css";
import type { LoyaltyLevel } from "../../model";
import LoyaltyApi from "../../api/LoyaltyApi";
import { useUserLoyaltyStore } from "../../store/store";
import { Crown } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { getMeThunk } from "@/entities/user/api/UserApi";
import {
  getNextLevel,
  getProgress,
  getRemainingToNext,
} from "../../lib/loyaltyHelpers";

export default function LoyaltyLevelCard() {
  const [levels, setLevels] = useState<LoyaltyLevel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const user = userState?.user;

  const userLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.userLoyaltyLevel,
  );

  const setUserLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.setUserLoyaltyLevel,
  );

  // Загружаем актуальные данные пользователя при монтировании
  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);
  console.log(user, 'USER');
  

  // Загружаем данные лояльности
  useEffect(() => {
    async function loadLoyaltyData() {
      try {
        const [userDiscountResponse, loyaltyLevels] = await Promise.all([
          LoyaltyApi.getUserDiscount(),
          LoyaltyApi.getLoyaltyLevels(),
        ]);
        setUserLoyaltyLevel(userDiscountResponse.data);
        setLevels(loyaltyLevels);
      } catch (error) {
        console.error("Failed to load loyalty data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLoyaltyData();
  }, [setUserLoyaltyLevel]);

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
    ? [...levels].reverse().find((level) => currentSpending >= level.min_spent)
    : undefined;

  const rawProgress = hasLevels ? getProgress(levels, currentSpending) : 0;

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

  // Определяем скидку для отображения
  const discountPct =
    currentLevel?.discount_pct ?? userLoyaltyLevel.discount_pct ?? 0;

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
            <span className="loyalty-card-discount-value">{discountPct}%</span>
          </p>
        </div>
        <div className="loyalty-card-discount-badge">
          <div className="loyalty-card-discount-badge-text">{discountPct}%</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="loyalty-card-progress-section">
        <div className="loyalty-card-progress-header">
          <span className="loyalty-card-progress-label">
            До следующего уровня
          </span>
          <span className="loyalty-card-progress-value">
            {hasLevels && nextLevel ? toNextLevel.toLocaleString("ru-RU") : "—"}{" "}
            ₽
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
            <>Информация о следующих уровнях появится позже.</>
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
                {discountPct}%
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
