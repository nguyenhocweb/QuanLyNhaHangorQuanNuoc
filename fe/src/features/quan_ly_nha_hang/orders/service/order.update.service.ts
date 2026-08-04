import axiosClient from "@/src/core/api/axios-instance";
import { Order } from "../type/order.type";

export const orderUpdateService = {
  updateOrder: async (id: string, payload: any) => {
    const { data } = await axiosClient.put<{ metadata: Order }>(`/restaurant-manager/order/${id}`, payload);
    return data.metadata;
  }
};
