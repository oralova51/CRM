import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useUserLoyaltyStore } from "../../store/store";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { getMeThunk } from "@/entities/user/api/UserApi";
import LoyaltyApi from "../../api/LoyaltyApi";
import type { LoyaltyLevel } from "../../model";
import {
  getNextLevel,
  getRemainingToNext,
} from "../../lib/loyaltyHelpers";
import "./CTA.css";

export function CTA() {
  const [levels, setLevels] = useState<LoyaltyLevel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user?.user);
  const userLoyaltyLevel = useUserLoyaltyStore(
    (state) => state.userLoyaltyLevel,
  );

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  useEffect(() => {
    async function loadLevels() {
      try {
        const loyaltyLevels = await LoyaltyApi.getLoyaltyLevels();
        setLevels(loyaltyLevels);
      } catch (error) {
        console.error("Failed to load loyalty levels", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLevels();
  }, []);

  const currentSpending = parseFloat(String(user?.totalSpent ?? 0)) || 0;
  const hasLevels = Array.isArray(levels) && levels.length > 0;
  const nextLevel = hasLevels ? getNextLevel(levels, currentSpending) : undefined;
  const toNextLevel = hasLevels
    ? getRemainingToNext(levels, currentSpending)
    : 0;

  const isMaxLevel = hasLevels && !nextLevel;
  const hasNextLevelInfo = hasLevels && nextLevel;

  if (isLoading && !userLoyaltyLevel) {
    return (
      <div className="cta cta-skeleton">
        <div className="cta-shimmer" />
      </div>
    );
  }

  if (!userLoyaltyLevel) {
    return (
      <div className="cta cta-empty">
        <div className="cta-icon-wrapper">
          <Heart className="cta-icon" />
        </div>
        <p className="cta-text">
          Вы особенная для нас. Продолжайте заботиться о себе!
        </p>
      </div>
    );
  }

  if (isMaxLevel) {
    return (
      <div className="cta">
        <div className="cta-icon-wrapper">
          <Heart className="cta-icon" />
        </div>
        <p className="cta-text">
          Вы особенная для нас. Продолжайте заботиться о себе. Вы на
          максимальном уровне программы лояльности — пользуйтесь всеми
          преимуществами!
        </p>
      </div>
    );
  }

  if (!hasNextLevelInfo) {
    return (
      <div className="cta">
        <div className="cta-icon-wrapper">
          <Heart className="cta-icon" />
        </div>
        <p className="cta-text">
          Вы особенная для нас. Продолжайте заботиться о себе!
        </p>
      </div>
    );
  }

  return (
    <div className="cta">
      <div className="cta-icon-wrapper">
        <Heart className="cta-icon" />
      </div>
      <p className="cta-text">
        Вы особенная для нас. Продолжайте заботиться о себе. Всего{" "}
        <span className="cta-highlight">
          {toNextLevel.toLocaleString("ru-RU")} ₽
        </span>{" "}
        до статуса{" "}
        <span className="cta-highlight">{nextLevel?.name ?? "—"}</span> и ещё
        больших преимуществ!
      </p>
    </div>
  );
}
