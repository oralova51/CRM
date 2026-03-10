import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import LoyaltyApi from "../../api/LoyaltyApi";
import type { ActivityStatistics } from "../../model";
import styles from "./Statistics.module.css";

export default function Statistics() {
  const [statistics, setStatistics] = useState<ActivityStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await LoyaltyApi.getActivityStatistics();
        if (response.data) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch activity statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Activity className={styles.icon} />
          </div>
          <h3 className={styles.title}>Статистика активности</h3>
        </div>
        <div className={styles.content}>
          <p className={styles.loading}>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Activity className={styles.icon} />
        </div>
        <h3 className={styles.title}>Статистика активности</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Посещений</span>
          <span className={styles.rowValue}>
            {statistics?.visits ?? 0}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Завершённых курсов</span>
          <span className={styles.rowValue}>—</span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Средний интервал</span>
          <span className={styles.rowValue}>
            {statistics?.averageInterval != null
              ? `${statistics.averageInterval} дней`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
