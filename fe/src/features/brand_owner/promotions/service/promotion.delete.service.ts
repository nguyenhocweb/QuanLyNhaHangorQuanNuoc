import axiosClient from "@/src/core/api/axios-instance";

export const deletePromotionService = async (brandId: string, promotionId: string): Promise<any> => {
    const { data } = await axiosClient.delete(`/brand-owner/${brandId}/promotion/${promotionId}`);
    return data;
};
