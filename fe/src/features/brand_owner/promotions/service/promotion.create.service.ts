import axiosClient from "@/src/core/api/axios-instance";

export const createPromotionService = async (brandId: string, payload: any): Promise<any> => {
    const { data } = await axiosClient.post(`/brand-owner/${brandId}/promotion`, payload);
    return data.data;
};
