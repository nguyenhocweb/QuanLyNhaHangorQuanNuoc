import axiosClient from "@/src/core/api/axios-instance";
import { GetReviewsResponse } from "../type/review.type";

interface GetReviewsParams {
    page?: number;
    limit?: number;
    rating?: number;
    sortBy?: 'newest' | 'helpful';
}

export const getReviewsByRestaurantService = async (
    restaurantId: string, 
    params: GetReviewsParams
): Promise<{ message: string, metadata: GetReviewsResponse }> => {
    return await axiosClient.get(`/customer/review/restaurant/${restaurantId}`, { params });
};
