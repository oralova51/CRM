// client/src/entities/booking/ui/BookingStatusBadge/BookingStatusBadge.tsx

import { CheckCircle2, XCircle, Circle, Clock } from "lucide-react";
import styles from "./BookingStatusBadge.module.css";
import type { BookingStatus } from "../../model/types";

type Props = {
  status: BookingStatus;
};

export function BookingStatusBadge({ status }: Props) {
  // Конфигурация для каждого статуса
  const statusConfig: Record<BookingStatus, { label: string; icon: typeof Circle; color: string }> = {
    pending: { 
      label: "Ожидает", 
      icon: Clock, 
      color: "blue" 
    },
    confirmed: { 
      label: "Подтверждено", 
      icon: Circle, 
      color: "green" 
    },
    completed: { 
      label: "Завершено", 
      icon: CheckCircle2, 
      color: "green" 
    },
    cancelled: { 
      label: "Отменено", 
      icon: XCircle, 
      color: "red" 
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`${styles.badge} ${styles[config.color]}`}>
      <Icon className={styles.icon} />
      <span className={styles.label}>{config.label}</span>
    </div>
  );
}