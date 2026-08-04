import axiosClient from "@/src/core/api/axios-instance";
import { GetUnreviewedResponse } from "../type/review.type";

interface GetUnreviewedParams {
    page?: number;
    limit?: number;
}

export const getUnreviewedMealsService = async (params: GetUnreviewedParams): Promise<{ message: string; metadata: GetUnreviewedResponse }> => {
    return await axiosClient.get('/customer/review/unreviewed', { params });
};
