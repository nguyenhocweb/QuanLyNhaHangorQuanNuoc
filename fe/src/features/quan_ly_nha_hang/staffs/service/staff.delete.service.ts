import axiosClient from "@/src/core/api/axios-instance";

export const deleteStaffService = async (id: string, restaurantId?: string): Promise<{ message: string; metadata: any }> => {
  const res = await axiosClient.delete(`/restaurant-manager/staff/${id}`, {
    params: { restaurantId }
  });
  return res.data;
};
