import { useState, useMemo } from "react";
import { VisitDot } from "@/entities/booking/ui/VisitDot/VisitDot";
import styles from "./VisitCalendar.module.css";

type Props = {
  visitDates: string[]; // массив дат в формате YYYY-MM-DD
  onMonthChange?: (year: number, month: number) => void;
};

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function VisitCalendar({ visitDates, onMonthChange }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Получаем первый день месяца и количество дней
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Преобразуем для понедельника как первого дня (0 = понедельник)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  // Проверяем, есть ли визит в эту дату
  const hasVisit = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return visitDates.includes(dateStr);
  };
  
  // Проверяем, является ли дата сегодняшней
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };
  
  // Создаем сетку календаря
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Пустые ячейки перед первым днём
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyCell} />);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isVisitDay = hasVisit(day);
      const isTodayDay = isToday(day);
      
      days.push(
        <div
          key={day}
          className={`${styles.dayCell} ${isTodayDay ? styles.today : ""}`}
        >
          <span className={styles.dayNumber}>{day}</span>
          {isVisitDay && <VisitDot />}
        </div>
      );
    }
    
    return days;
  }, [adjustedFirstDay, daysInMonth, visitDates, month, year]);

  return (
    <div className={styles.calendar}>
      {/* Заголовок календаря */}
      <div className={styles.header}>
        <button
          onClick={goToPreviousMonth}
          className={styles.navButton}
          aria-label="Предыдущий месяц"
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className={styles.monthTitle}>
          {monthNames[month]} {year}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className={styles.navButton}
          aria-label="Следующий месяц"
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Дни недели */}
      <div className={styles.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      {/* Сетка календаря */}
      <div className={styles.grid}>
        {calendarDays}
      </div>

      {/* Легенда */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.visitDot} />
          <span className={styles.legendText}>День визита</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.todayDot} />
          <span className={styles.legendText}>Сегодня</span>
        </div>
      </div>
    </div>
  );
}