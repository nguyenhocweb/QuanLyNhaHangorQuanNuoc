import axiosClient from "@/src/core/api/axios-instance";
import { GetPromotionsResponse } from "../type/promotion.type";

export const getPromotionsService = async (brandId: string, params?: any): Promise<GetPromotionsResponse> => {
    const { data } = await axiosClient.get(`/brand-owner/${brandId}/promotion`, { params });
    return data.data; // Assuming backend returns { message, data: { items, meta } }
};
