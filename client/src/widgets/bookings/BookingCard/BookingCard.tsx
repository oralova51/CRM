import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { BookingStatusBadge } from "@/entities/booking/ui/BookingStatusBadge/BookingStatusBadge";
import { ConfirmModal } from "@/shared/ui/ConfirmModal/ConfirmModal";
import { useCancelBooking } from "@/features/bookings/cancel-booking/useCancelBooking";
import { useRescheduleBooking } from "@/features/bookings/reschedule-booking/useRescheduleBooking";
import type { Booking } from "@/entities/booking/model/types";
import styles from "./BookingCard.module.css";
import { useToast } from '@/shared/lib/toast/ToastContext';

type Props = {
  booking: Booking;
  procedureName: string;
  showActions?: boolean;
};

export function BookingCard({
  booking,
  procedureName,
  showActions = true,
}: Props) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const { cancelBooking, isLoading: isCancelling } = useCancelBooking();
  const { rescheduleBooking, isLoading: isRescheduling } = useRescheduleBooking();
  const toast = useToast();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Проверяем, прошла ли дата записи
  const isPastDate = () => {
    const bookingDate = new Date(booking.scheduled_at);
    return bookingDate < new Date();
  };

  const isPast = isPastDate();
  // Кнопки показываем только если запись не прошла и это страница с действиями
  const showButtons = showActions && !isPast;

  const handleCancel = async () => {
    const result = await cancelBooking(booking.id);
    if (result.success) {
      setShowCancelModal(false);
      toast.success('Запись успешно отменена');
    } else {
      toast.error('Не удалось отменить запись');
    }
  };

  const handleReschedule = async () => {
    setShowRescheduleModal(false);
    await rescheduleBooking(booking.id);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{procedureName}</h3>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className={styles.datetime}>
          <div className={styles.datetimeItem}>
            <Calendar className={styles.icon} />
            <span>{formatDate(booking.scheduled_at)}</span>
          </div>
          <div className={styles.datetimeItem}>
            <Clock className={styles.icon} />
            <span>{formatTime(booking.scheduled_at)}</span>
          </div>
        </div>

        {showButtons && (
          <div className={styles.actions}>
            <button
              className={`${styles.rescheduleButton} ${booking.status !== 'pending' ? styles.disabled : ''}`}
              onClick={() => booking.status === 'pending' && setShowRescheduleModal(true)}
              disabled={booking.status !== 'pending'}
            >
              Перенести
            </button>
            <button
              className={`${styles.cancelButton} ${booking.status !== 'pending' ? styles.disabled : ''}`}
              onClick={() => booking.status === 'pending' && setShowCancelModal(true)}
              disabled={booking.status !== 'pending'}
            >
              Отменить
            </button>
          </div>
        )}

        {isPast && booking.status === 'pending' && (
          <div className={styles.pastNote}>
            Время записи прошло
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения отмены */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Отмена записи"
        message={`Вы уверены, что хотите отменить запись на "${procedureName}"?`}
        confirmText="Отменить запись"
        cancelText="Оставить"
        isLoading={isCancelling}
      />

      {/* Модальное окно подтверждения переноса */}
      <ConfirmModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleReschedule}
        title="Перенос записи"
        message={`Текущая запись на "${procedureName}" будет отменена. Вы сможете выбрать новое время.`}
        confirmText="Перенести"
        cancelText="Оставить"
        isLoading={isRescheduling}
      />
    </>
  );
}