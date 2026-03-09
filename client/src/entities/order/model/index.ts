import type { ServerResponseType } from "@/shared/types";

export type OrderStatus = "pending" | "completed" | "canceled";
export type PaymentMethod = "card" | "cash" | "online";

export type Order = {
  id: number;
  user_id: number;
  price: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  discount_pct: number;
  final_price: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderRequest = {
  user_id: number;
  price: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  discount_pct?: number;
  final_price: string;
};

export type UpdateOrderRequest = Partial<
  Omit<CreateOrderRequest, "user_id">
> & { user_id?: number };

export type OrderResponse = ServerResponseType<Order>;
export type OrderDeleteResponse = ServerResponseType<null>;

/** Формат data в ответах API бэкенда (get/create/update) */
export type OrderApiData = { order: Order };

/** Формат data в ответе API для списка заказов пользователя */
export type OrdersApiData = { orders: Order[] };
export type OrdersResponse = ServerResponseType<Order[]>;
