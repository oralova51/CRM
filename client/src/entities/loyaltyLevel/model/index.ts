export type ServerResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  error: string | null;
};

export type LoyaltyLevel = {
  id: number;
  name: string;
  min_spent: number;
  discount_pct: number;
  created_at: string;
  updated_at: string;
};

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Тип процедуры, приходящей в include (без id, description и т.д.)
export type BookingProcedure = {
  name: string;
  duration_min: number;
  price: string;  // DECIMAL приходит как строка
};

// Базовый тип записи из API (точное соответствие ответу)
export type BookingApiItem = {
  id: number;
  user_id: number;
  procedure_id: number;
  scheduled_at: string;
  status: BookingStatus;
  price_paid: string;  // DECIMAL приходит как строка
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  Procedure: BookingProcedure;
};

export type UserLoyaltyLevel = ServerResponseType<LoyaltyLevel>;

export type LoyaltyLevelResponse = ServerResponseType<LoyaltyLevel>;

export type ActivityStatistics = {
  visits: number;
  averageInterval: number | null;
};
export type LoyaltyLevelArrayType = LoyaltyLevelResponse[];