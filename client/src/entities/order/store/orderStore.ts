import { create } from "zustand";
import OrderApi from "../api/OrderApi";
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../model";

type OrderState = {
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  isCreateLoading: boolean;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  error: string | null;
};

type OrderActions = {
  setCurrentOrder: (order: Order | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearCurrentOrder: () => void;

  fetchOrderById: (id: number) => Promise<Order | null>;
  createOrder: (body: CreateOrderRequest) => Promise<Order | null>;
  updateOrder: (id: number, body: UpdateOrderRequest) => Promise<Order | null>;
  deleteOrder: (id: number) => Promise<boolean>;
};

const initialState: OrderState = {
  currentOrder: null,
  orders: [],
  isLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,
  isDeleteLoading: false,
  error: null,
};

export const useOrderStore = create<OrderState & OrderActions>((set, get) => ({
  ...initialState,

  setCurrentOrder: (currentOrder) => set({ currentOrder }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    const response = await OrderApi.getOrderById(id);
    set({ isLoading: false });

    if (response.statusCode !== 200 || !response.data) {
      set({
        error: response.message ?? response.error ?? "Не удалось загрузить заказ",
      });
      return null;
    }

    set({ currentOrder: response.data });
    return response.data;
  },

  createOrder: async (body) => {
    set({ isCreateLoading: true, error: null });
    const response = await OrderApi.createOrder(body);
    set({ isCreateLoading: false });

    if (response.statusCode !== 201 || !response.data) {
      set({
        error:
          response.message ?? response.error ?? "Не удалось создать заказ",
      });
      return null;
    }

    const order = response.data;
    set((state) => ({
      currentOrder: order,
      orders: [...state.orders, order],
    }));
    return order;
  },

  updateOrder: async (id, body) => {
    set({ isUpdateLoading: true, error: null });
    const response = await OrderApi.updateOrder(id, body);
    set({ isUpdateLoading: false });

    if (response.statusCode !== 200 || !response.data) {
      set({
        error:
          response.message ?? response.error ?? "Не удалось обновить заказ",
      });
      return null;
    }

    const order = response.data;
    set((state) => ({
      currentOrder: state.currentOrder?.id === id ? order : state.currentOrder,
      orders: state.orders.map((o) => (o.id === id ? order : o)),
    }));
    return order;
  },

  deleteOrder: async (id) => {
    set({ isDeleteLoading: true, error: null });
    const response = await OrderApi.deleteOrder(id);
    set({ isDeleteLoading: false });

    if (response.statusCode !== 200) {
      set({
        error:
          response.message ?? response.error ?? "Не удалось удалить заказ",
      });
      return false;
    }

    set((state) => ({
      currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
      orders: state.orders.filter((o) => o.id !== id),
    }));
    return true;
  },
}));
