import axiosClient from "@/src/core/api/axios-instance";
import { UpdateStaffFormValues } from "../schema/staff.update.schema";

export const updateStaffService = async (brandId: string, staffId: string, data: UpdateStaffFormValues) => {
    const response = await axiosClient.put(`/brand-owner/${brandId}/employment/${staffId}`, data);
    return response.data;
};
