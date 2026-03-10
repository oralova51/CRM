// client/src/widgets/booking-form/TimeSelectionStep/TimeSelectionStep.tsx

import { Clock } from "lucide-react";
import { useMemo } from "react";
import styles from "./TimeSelectionStep.module.css";

type Props = {
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  selectedService: string;
  selectedDate: string;
};

// Доступные временные слоты
const timeSlots = [
  "09:00", "09:30","10:00", "10:30", "11:00", "11:30", "12:00","12:30", '13:00', '13:30', "14:00", '14:30',
  "15:00", "15:30", "16:00", '16:30', "17:00", "17:30" ,"18:00", '18:30', "19:00"
];

export function TimeSelectionStep({ 
  selectedTime, 
  onSelect, 
  onConfirm, 
  onBack,
  selectedService,
  selectedDate 
}: Props) {
  
  // Проверяем, является ли выбранная дата сегодняшней
  const isToday = useMemo(() => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return (
      today.getDate() === selected.getDate() &&
      today.getMonth() === selected.getMonth() &&
      today.getFullYear() === selected.getFullYear()
    );
  }, [selectedDate]);

  // Проверяем, доступно ли время для выбора
  const isTimeSlotAvailable = (time: string) => {
    if (!isToday) return true; // Если дата не сегодня, все слоты доступны
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);
    
    return slotTime > now; // Слот доступен только если его время ещё не наступило
  };

  // Фильтруем слоты, оставляя только доступные
  const availableTimeSlots = useMemo(() => {
    return timeSlots.filter(isTimeSlotAvailable);
  }, [isToday]);

  // Если текущий выбранный слот стал недоступен, сбрасываем его
  if (selectedTime && !isTimeSlotAvailable(selectedTime)) {
    onSelect('');
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите время</h2>
      
      {availableTimeSlots.length === 0 ? (
        <div className={styles.noSlots}>
          <p className={styles.noSlotsText}>
            На сегодня нет доступного времени
          </p>
          <p className={styles.noSlotsSubtext}>
            Пожалуйста, выберите другую дату
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {timeSlots.map((time) => {
            const isAvailable = isTimeSlotAvailable(time);
            
            return (
              <button
                key={time}
                className={`
                  ${styles.timeButton} 
                  ${selectedTime === time ? styles.selected : ''}
                  ${!isAvailable ? styles.disabled : ''}
                `}
                onClick={() => isAvailable && onSelect(time)}
                disabled={!isAvailable}
              >
                <Clock className={styles.icon} />
                <span>{time}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedTime && (
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Ваша запись:</h3>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Услуга:</span>
              <span className={styles.summaryValue}>{selectedService}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Дата:</span>
              <span className={styles.summaryValue}>
                {new Date(selectedDate).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Время:</span>
              <span className={styles.summaryValue}>{selectedTime}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>
          Назад
        </button>
        <button
          className={styles.confirmButton}
          disabled={!selectedTime}
          onClick={onConfirm}
        >
          Подтвердить запись
        </button>
      </div>
    </div>
  );
}