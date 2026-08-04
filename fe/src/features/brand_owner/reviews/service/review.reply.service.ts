import axiosClient from "@/src/core/api/axios-instance";
import { ReviewReplyFormValues } from "../schema/review.reply.schema";

export const replyReviewService = async (brandId: string, reviewId: string, data: ReviewReplyFormValues) => {
    return await axiosClient.put(`/brand-owner/${brandId}/review/${reviewId}/reply`, data);
};
