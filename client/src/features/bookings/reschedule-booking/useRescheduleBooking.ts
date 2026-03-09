import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { updateBookingStatusThunk } from "@/entities/booking/api/bookingApi";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";

export const useRescheduleBooking = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rescheduleBooking = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Отменяем старую запись
      await dispatch(updateBookingStatusThunk({ 
        id, 
        status: { status: 'cancelled' } 
      })).unwrap();
      
      // Перенаправляем на страницу записи для создания новой
      navigate(CLIENT_ROUTES.BOOK, { 
        state: { rescheduledFrom: id } 
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err as string;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rescheduleBooking,
    isLoading,
    error,
  };
};