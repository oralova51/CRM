// client/src/features/bookings/cancel-booking/useCancelBooking.ts

import { useState } from "react";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { updateBookingStatusThunk } from "@/entities/booking/api/bookingApi";

export const useCancelBooking = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(updateBookingStatusThunk({ 
        id, 
        status: { status: 'cancelled' } 
      })).unwrap();
      
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err as string;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelBooking,
    isLoading,
    error,
  };
};