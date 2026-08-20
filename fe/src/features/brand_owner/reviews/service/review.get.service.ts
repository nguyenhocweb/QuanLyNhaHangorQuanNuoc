import axiosClient from "@/src/core/api/axios-instance";
import { GetReviewsResponse } from "../../../customer/reviews/type/review.type";

interface GetBrandReviewsParams {
    restaurantId?: string;
    page?: number;
    limit?: number;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED_SPAM';
    rating?: number;
}

export const getBrandReviewsService = async (
    brandId: string, 
    params: GetBrandReviewsParams
): Promise<{ message: string, metadata: GetReviewsResponse }> => {
    const response = await axiosClient.get(`/brand-owner/${brandId}/review`, { params });
    return response.data;
};
