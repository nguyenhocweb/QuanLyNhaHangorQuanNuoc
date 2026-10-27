import axiosClient from "@/src/core/api/axios-instance";
import { Promotion } from "../type/promotion.type";

export const togglePromotionService = async (id: string): Promise<Promotion> => {
  const response = await axiosClient.patch(`/restaurant-manager/promotion/${id}/toggle`);
  return response.data?.metadata;
};
