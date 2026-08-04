import axiosClient from "@/src/core/api/axios-instance";
import { IUpdateStaffPayload, IStaff } from "../type/staff.type";

export const updateStaffService = async (id: string, payload: IUpdateStaffPayload): Promise<{ message: string; metadata: IStaff }> => {
  const res = await axiosClient.put(`/restaurant-manager/staff/${id}`, payload);
  return res.data;
};
