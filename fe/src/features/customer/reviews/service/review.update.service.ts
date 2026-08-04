import axiosClient from "@/src/core/api/axios-instance";
import { ReviewUpdateFormValues } from "../schema/review.update.schema";
import { Review } from "../type/review.type";

export const updateReviewService = async (reviewId: string, data: ReviewUpdateFormValues): Promise<{ message: string; metadata: Review }> => {
    return await axiosClient.put(`/customer/review/${reviewId}`, data);
};
