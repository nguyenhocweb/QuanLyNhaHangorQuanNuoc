import axiosClient from "@/src/core/api/axios-instance";
import { LoyaltyInfoResponse, LoyaltyTransaction } from "../type/loyalty.type";

export const getMyLoyaltyInfoService = async (): Promise<{ message: string, metadata: LoyaltyInfoResponse }> => {
    return axiosClient.get("/customer/loyalty");
}

export const getMyLoyaltyHistoryService = async (params?: { brandId?: string, restaurantId?: string }): Promise<{ message: string, metadata: LoyaltyTransaction[] }> => {
    return axiosClient.get("/customer/loyalty/history", { params });
}
