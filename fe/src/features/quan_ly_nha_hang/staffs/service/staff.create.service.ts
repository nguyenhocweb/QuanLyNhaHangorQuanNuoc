import axiosClient from "@/src/core/api/axios-instance";
import { ICreateStaffPayload, IStaff } from "../type/staff.type";

export const createStaffService = async (payload: ICreateStaffPayload): Promise<{ message: string; metadata: IStaff }> => {
  if (!payload.restaurantId) throw new Error("restaurantId is required");
  const res = await axiosClient.post(`/restaurant-manager/${payload.restaurantId}/staff`, payload);
  return res.data;
};
