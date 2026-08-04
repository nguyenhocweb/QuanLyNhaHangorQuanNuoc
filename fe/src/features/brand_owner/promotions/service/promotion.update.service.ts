import axiosClient from "@/src/core/api/axios-instance";

export const updatePromotionService = async (brandId: string, promotionId: string, payload: any): Promise<any> => {
    const { data } = await axiosClient.put(`/brand-owner/${brandId}/promotion/${promotionId}`, payload);
    return data.data;
};
