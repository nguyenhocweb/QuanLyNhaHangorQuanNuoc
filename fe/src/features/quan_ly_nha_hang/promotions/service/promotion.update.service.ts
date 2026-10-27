import axiosClient from "@/src/core/api/axios-instance";
import { Promotion } from "../type/promotion.type";

export const updatePromotionService = async (id: string, data: Partial<Promotion>): Promise<Promotion> => {
  const response = await axiosClient.put(`/restaurant-manager/promotion/${id}`, data);
  return response.data?.metadata;
};
