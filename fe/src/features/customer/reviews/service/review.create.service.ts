import axiosClient from "@/src/core/api/axios-instance";
import { ReviewCreateFormValues } from "../schema/review.create.schema";

export const createReviewService = async (data: ReviewCreateFormValues) => {
    return await axiosClient.post('/customer/review', data);
};
