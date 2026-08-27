import axiosClient from "@/src/core/api/axios-instance";

export const deleteStaffService = async (id: string, restaurantId?: string): Promise<{ message: string; metadata: any }> => {
  if (!restaurantId) throw new Error("restaurantId is required");
  const res = await axiosClient.delete(`/restaurant-manager/${restaurantId}/staff/${id}`);
  return res.data;
};
