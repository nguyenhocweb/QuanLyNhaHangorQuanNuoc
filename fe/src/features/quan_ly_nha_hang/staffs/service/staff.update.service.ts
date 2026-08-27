import axiosClient from "@/src/core/api/axios-instance";
import { IUpdateStaffPayload, IStaff } from "../type/staff.type";

export const updateStaffService = async (id: string, payload: IUpdateStaffPayload): Promise<{ message: string; metadata: IStaff }> => {
  if (!payload.restaurantId) throw new Error("restaurantId is required");
  const res = await axiosClient.put(`/restaurant-manager/${payload.restaurantId}/staff/${id}`, payload);
  return res.data;
};
