import axiosClient from "@/src/core/api/axios-instance";
import { ReviewData } from "../type/review.type";

export const getReviewsService = async (params: any): Promise<{ metadata: ReviewData }> => {
    const { data } = await axiosClient.get("/restaurant-manager/review", { params });
    return data;
};

export const getRestaurantReviewsService = async (restaurantId: string, params: any) => {
    const { data } = await axiosClient.get("/restaurant-manager/review", { params: { ...params, restaurantId } });
    return data;
};