import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllProceduresThunk } from "@/entities/procedure/api/procedureApi";
import { getMyBookingsThunk } from "@/entities/booking/api/bookingApi";
import { BookingsList } from "@/widgets/bookings/BookingsList/BookingsList";
import styles from "./ProcedureCalendarPage.module.css";

export function ProcedureCalendarPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { procedures } = useAppSelector((state) => state.procedures);
  const { upcomingBookings, pastBookings, isLoading } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getAllProceduresThunk());
    if (user) {
      dispatch(getMyBookingsThunk());
    }
  }, [dispatch, user]);

  // Создаем Map для быстрого поиска названий процедур
  const proceduresMap = useMemo(() => {
    return new Map(procedures.map(p => [p.id, p.name]));
  }, [procedures]);

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
          <h1 className={styles.title}>Календарь процедур</h1>
          <p className={styles.subtitle}>Ваши предстоящие и прошлые визиты</p>
        </div>

        <BookingsList
          title="Предстоящие визиты"
          bookings={upcomingBookings}
          proceduresMap={proceduresMap}
          emptyMessage="У вас нет предстоящих записей"
          showActions={true}
        />

        <BookingsList
          title="История визитов"
          bookings={pastBookings}
          proceduresMap={proceduresMap}
          emptyMessage="История посещений пуста"
          showActions={false}
        />
      </div>
    </div>
  );
}