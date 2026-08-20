import axiosClient from "@/src/core/api/axios-instance";

export const deletePromotionService = async (id: string): Promise<boolean> => {
  const response = await axiosClient.delete(`/restaurant-manager/promotion/${id}`);
  return response.data?.success;
};
