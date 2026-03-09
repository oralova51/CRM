import { useState } from "react";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { createBookingThunk } from "@/entities/booking/api/bookingApi";
import type { CreateBookingData } from "@/entities/booking/model/types";

export const useCreateBooking = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: CreateBookingData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dispatch(createBookingThunk(data)).unwrap();
      return result;
    } catch (err) {
      setError(err as string);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
    error,
  };
};