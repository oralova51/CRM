import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getMyBookingsThunk } from "@/entities/booking/api/bookingApi";
import { StatsCards } from "@/widgets/visit-history/StatsCards/StatsCards";
import { VisitCalendar } from "@/widgets/visit-history/VisitCalendar/VisitCalendar";
import styles from "./VisitHistoryPage.module.css";

export default function VisitHistoryPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { pastBookings, isLoading } = useAppSelector((state) => state.bookings);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user) {
      dispatch(getMyBookingsThunk());
    }
  }, [dispatch, user]);

  // Получаем все даты визитов (только completed)
  const allVisitDates = useMemo(() => {
    return pastBookings
      .filter(booking => booking.status === 'completed')
      .map(booking => booking.scheduled_at.split('T')[0]);
  }, [pastBookings]);

  // Получаем даты визитов за текущий месяц
  const visitsThisMonth = useMemo(() => {
    return allVisitDates.filter(date => {
      const [year, month] = date.split('-').map(Number);
      return year === currentYear && month === currentMonth;
    }).length;
  }, [allVisitDates, currentMonth, currentYear]);

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>История визитов</h1>
          <p className={styles.subtitle}>Отслеживайте свою активность</p>
        </div>

        <StatsCards 
          visitsThisMonth={visitsThisMonth}
          totalVisits={allVisitDates.length}
        />

        <VisitCalendar 
          visitDates={allVisitDates}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}