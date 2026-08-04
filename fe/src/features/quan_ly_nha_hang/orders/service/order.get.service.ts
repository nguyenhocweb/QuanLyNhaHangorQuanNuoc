import axiosClient from "@/src/core/api/axios-instance";
import { OrderListResponse, Order } from "../type/order.type";

export const orderGetService = {
  getOrders: async (params: { page: number; limit: number; status?: string; search?: string; dateFilter?: string }) => {
    const { data } = await axiosClient.get<OrderListResponse>('/restaurant-manager/order', { params });
    return data.metadata;
  },
  
  getOrderById: async (id: string) => {
    const { data } = await axiosClient.get<{ metadata: Order }>(`/restaurant-manager/order/${id}`);
    return data.metadata;
  }
};
