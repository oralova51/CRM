export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Booking = {
  id: number;
  user_id: number;
  procedure_id: number;
  scheduled_at: string; // ISO date string
  status: BookingStatus;
  price_paid: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Эти поля придут из include в сервисе
  Procedure?: {
    name: string;
    duration_min: number;
    price: number;
  };
};

export type BookingState = {
  bookings: Booking[];
  currentBooking: Booking | null;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  isLoading: boolean;
  error: string | null;
};

export const initialBookingState: BookingState = {
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  pastBookings: [],
  isLoading: false,
  error: null,
};

// Типы для создания/обновления
export type CreateBookingData = {
  procedure_id: number;
  scheduled_at: string;
  notes?: string | null;
  user_id?: number;
};

export type UpdateBookingStatusData = {
  status: BookingStatus;
};