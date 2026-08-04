import axiosClient from "@/src/core/api/axios-instance";
import { ReviewStatusFormValues } from "../schema/review.status.schema";

export const updateReviewStatusService = async (reviewId: string, data: ReviewStatusFormValues) => {
    return await axiosClient.patch(`/system-admin/review/${reviewId}/status`, data);
};
