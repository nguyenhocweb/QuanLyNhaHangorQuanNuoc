import axiosClient from "@/src/core/api/axios-instance";
import { GetMyReviewsResponse } from "../type/review.type";

interface GetMyReviewsParams {
    page?: number;
    limit?: number;
    status?: string;
    rating?: string;
}

export const getMyReviewsService = async (params: GetMyReviewsParams): Promise<{ message: string; metadata: GetMyReviewsResponse }> => {
    return await axiosClient.get('/customer/review/my-reviews', { params });
};
