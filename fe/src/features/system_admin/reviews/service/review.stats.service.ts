import axiosClient from "@/src/core/api/axios-instance";

export interface SystemReviewStats {
    totalReviews: number;
    publicReviews: number;
    hiddenReviews: number;
    repliedReviews: number;
    avgRatings: {
        overall: number;
        food: number;
        service: number;
        ambiance: number;
    };
}

export const getSystemReviewStatsService = async (): Promise<{ message: string, metadata: SystemReviewStats }> => {
    return await axiosClient.get(`/system-admin/review/stats`);
};
