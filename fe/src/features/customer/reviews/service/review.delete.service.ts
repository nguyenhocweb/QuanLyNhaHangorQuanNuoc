import axiosClient from "@/src/core/api/axios-instance";

export const deleteReviewService = async (reviewId: string): Promise<{ message: string; metadata: null }> => {
    return await axiosClient.delete(`/customer/review/${reviewId}`);
};
