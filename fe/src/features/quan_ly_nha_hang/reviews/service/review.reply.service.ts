import axiosClient from "@/src/core/api/axios-instance";

export const replyReviewService = async (id: string, staff_response: string, restaurantId?: string) => {
    return axiosClient.patch(`/restaurant-manager/review/${id}/reply`, { staff_response, restaurantId });
};