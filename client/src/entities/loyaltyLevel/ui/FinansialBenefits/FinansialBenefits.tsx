// FinansialBenefits.tsx
import React, { useEffect, useState } from "react";
import { TrendingUp, Wallet } from "lucide-react";
import styles from "./FinansialBenefits.module.css";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { getMeThunk } from "@/entities/user/api/UserApi";
import LoyaltyApi from "../../api/LoyaltyApi";
import { useUserLoyaltyStore } from "../../store/store";
import { getEconomicBenefits } from "../../lib/loyaltyHelpers";

export function FinansialBenefits() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const user = userState?.user;

  const [discountsReceived, setDiscountsReceived] = useState(0);
  const [savedPercentage, setSavedPercentage] = useState(0);

  useEffect(() => {
    dispatch(getMeThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!user?.id) return;
    getEconomicBenefits(user.id).then(({ discountsReceived, savedPercentage }) => {
      setDiscountsReceived(discountsReceived);
      setSavedPercentage(savedPercentage);
    });
  }, [user?.id]);

  const totalSpent = user?.totalSpent;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Wallet className={styles.icon} />
        </div>
        <h3 className={styles.title}>Финансовые преимущества</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <p className={styles.rowLabel}>Вы заплатили в студии</p>
          <p className={styles.rowValue}>
            {totalSpent?.toLocaleString("ru-RU") || 0} ₽
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.row}>
          <p className={styles.rowLabel}>Получено скидок</p>
          <p className={styles.rowValueGreen}>
            {discountsReceived.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        {/* Savings Highlight */}
        <div className={styles.savingsHighlight}>
          <div className={styles.savingsContent}>
            <span className={styles.savingsLabel}>Ваша экономия</span>
            <div className={styles.savingsPercentageWrapper}>
              <TrendingUp className={styles.savingsIcon} />
              <span className={styles.savingsPercentage}>
                {savedPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
