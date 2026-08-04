import axiosClient from "@/src/core/api/axios-instance";
import { DiscoverResponse } from "../type/promotion.type";

interface GetDiscoverParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
}

export const getDiscoverPromotionsService = async (params: GetDiscoverParams = {}): Promise<{ message: string; metadata: DiscoverResponse }> => {
    const res = await axiosClient.get("/customer/promotion/discover", { params });
    return res.data;
};
