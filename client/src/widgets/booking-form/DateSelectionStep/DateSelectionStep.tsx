import styles from "./DateSelectionStep.module.css";

type Props = {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  onNext: () => void;
  onBack: () => void;
};

// Вспомогательная функция для получения массива дат
const getDates = (daysCount: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Форматирование даты для отображения
const formatDate = (date: Date) => {
  return {
    dayOfWeek: date.toLocaleDateString("ru-RU", { weekday: "short" }),
    day: date.getDate(),
    month: date.toLocaleDateString("ru-RU", { month: "short" }),
    fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD
  };
};

export function DateSelectionStep({ selectedDate, onSelect, onNext, onBack }: Props) {
  const dates = getDates(15); // Показываем 15 дней вперед

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите дату</h2>
      
      <div className={styles.grid}>
        {dates.map((date) => {
          const { dayOfWeek, day, month, fullDate } = formatDate(date);
          const isSelected = selectedDate === fullDate;
          
          return (
            <button
              key={fullDate}
              className={`${styles.dateButton} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelect(fullDate)}
            >
              <span className={styles.dayOfWeek}>{dayOfWeek}</span>
              <span className={styles.day}>{day}</span>
              <span className={styles.month}>{month}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>
          Назад
        </button>
        <button
          className={styles.nextButton}
          disabled={!selectedDate}
          onClick={onNext}
        >
          Далее
        </button>
      </div>
    </div>
  );
}