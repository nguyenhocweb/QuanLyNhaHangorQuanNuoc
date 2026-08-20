import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/src/core/api/axios-instance";

export const getPromotionByIdService = async (brandId: string, promotionId: string) => {
    const { data } = await axiosClient.get(`/brand-owner/${brandId}/promotion/${promotionId}`);
    return data.data;
};

export const useGetPromotionById = (brandId: string, promotionId: string) => {
    return useQuery({
        queryKey: ["BrandPromotionDetails", brandId, promotionId],
        queryFn: () => getPromotionByIdService(brandId, promotionId),
        enabled: !!brandId && !!promotionId,
    });
};
