import axiosClient from "@/src/core/api/axios-instance";

export const deleteStaffService = async (brandId: string, staffId: string) => {
    const response = await axiosClient.delete(`/brand-owner/${brandId}/employment/${staffId}`);
    return response.data;
};
