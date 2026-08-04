import axiosClient from "@/src/core/api/axios-instance";
import { ICreateStaffPayload, IStaff } from "../type/staff.type";

export const createStaffService = async (payload: ICreateStaffPayload): Promise<{ message: string; metadata: IStaff }> => {
  const res = await axiosClient.post("/restaurant-manager/staff", payload);
  return res.data;
};
