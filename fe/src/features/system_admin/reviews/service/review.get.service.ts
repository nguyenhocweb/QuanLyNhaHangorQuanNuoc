import axiosClient from "@/src/core/api/axios-instance";
import { GetReviewsResponse } from "../../../customer/reviews/type/review.type";

export const getSystemReviewsService = async (
    params: any
): Promise<{ message: string, metadata: GetReviewsResponse }> => {
    return await axiosClient.get(`/system-admin/review`, { params });
};
