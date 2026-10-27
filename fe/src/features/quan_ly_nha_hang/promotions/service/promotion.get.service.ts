import axiosClient from "@/src/core/api/axios-instance";
import { Promotion } from "../type/promotion.type";

export const getPromotionsService = async (restaurantId: string): Promise<Promotion[]> => {
  const response = await axiosClient.get(`/restaurant-manager/promotion`, {
    params: { restaurantId },
  });
  return response.data?.metadata || [];
};

export const getPromotionByIdService = async (id: string): Promise<Promotion> => {
  const response = await axiosClient.get(`/restaurant-manager/promotion/${id}`);
  return response.data?.metadata;
};
