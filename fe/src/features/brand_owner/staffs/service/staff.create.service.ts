import axiosClient from "@/src/core/api/axios-instance";
import { CreateStaffFormValues } from "../schema/staff.create.schema";

export const createStaffService = async (brandId: string, payload: CreateStaffFormValues) => {
  const { data } = await axiosClient.post(`/brand-owner/${brandId}/employment`, payload);
  return data;
};
