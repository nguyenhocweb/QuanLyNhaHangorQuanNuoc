import axiosClient from "@/src/core/api/axios-instance";
import { Promotion } from "../type/promotion.type";

export const createPromotionService = async (data: Partial<Promotion>): Promise<Promotion> => {
  const response = await axiosClient.post(`/restaurant-manager/promotion`, data);
  return response.data?.metadata;
};
