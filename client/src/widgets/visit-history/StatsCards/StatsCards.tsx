import { Calendar, TrendingUp } from "lucide-react";
import styles from "./StatsCards.module.css";

type Props = {
  visitsThisMonth: number;
  totalVisits: number;
};

export function StatsCards({ visitsThisMonth, totalVisits }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Calendar className={styles.icon} />
          <span className={styles.cardLabel}>В этом месяце</span>
        </div>
        <div className={styles.cardValue}>{visitsThisMonth}</div>
        <p className={styles.cardFootnote}>посещений</p>
      </div>
      
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <TrendingUp className={styles.icon} />
          <span className={styles.cardLabel}>Всего</span>
        </div>
        <div className={styles.cardValue}>{totalVisits}</div>
        <p className={styles.cardFootnote}>визитов</p>
      </div>
    </div>
  );
}