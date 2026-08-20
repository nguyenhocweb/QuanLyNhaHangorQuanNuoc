import axiosClient from "@/src/core/api/axios-instance";

export interface PublicReviewItem {
    id: string;
    name: string;
    role: string;
    avatar: string;
    restaurant: string;
    rating: number;
    comment: string;
    date: string;
}

export interface PublicReviewResponse {
    message: string;
    metadata: {
        items: PublicReviewItem[];
        total: number;
    };
}

export const getFeaturedReviewsService = async (limit = 9): Promise<PublicReviewResponse> => {
    return axiosClient.get(`/review/featured?limit=${limit}`);
};
