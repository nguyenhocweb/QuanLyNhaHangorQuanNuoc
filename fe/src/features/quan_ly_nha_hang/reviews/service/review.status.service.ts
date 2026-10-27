import axiosClient from "@/src/core/api/axios-instance";
import { ReviewStatus } from "../type/review.type";

export const updateReviewStatusService = async (id: string, status: ReviewStatus, restaurantId?: string) => {
    return axiosClient.patch(`/restaurant-manager/review/${id}/status`, { status, restaurantId });
};