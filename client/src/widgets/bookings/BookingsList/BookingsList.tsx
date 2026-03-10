import { BookingCard } from "../BookingCard/BookingCard";
import type { Booking } from "@/entities/booking/model/types";
import styles from "./BookingsList.module.css";

type Props = {
  title: string;
  bookings: Booking[];
  proceduresMap: Map<number, string>;
  emptyMessage: string;
  showActions?: boolean;
};

export function BookingsList({ 
  title, 
  bookings, 
  proceduresMap,
  emptyMessage,
  showActions = true,
}: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {title} ({bookings.length})
      </h2>
      
      <div className={styles.list}>
        {bookings.length === 0 ? (
          <p className={styles.empty}>{emptyMessage}</p>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              procedureName={proceduresMap.get(booking.procedure_id) || "Неизвестная процедура"}
              showActions={showActions}
            />
          ))
        )}
      </div>
    </div>
  );
}