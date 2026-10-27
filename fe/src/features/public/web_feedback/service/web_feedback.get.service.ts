import axiosClient from "@/src/core/api/axios-instance";
import { IPublicFeedbacksResponse } from "../type/web_feedback.type";

export interface GetPublicFeedbacksParams {
  page?: number;
  limit?: number;
  category?: string;
  isFeatured?: boolean;
}

export const getPublicFeedbacksService = async (params: GetPublicFeedbacksParams = {}): Promise<IPublicFeedbacksResponse> => {
  const res = await axiosClient.get("/public/web-feedback", { params });
  return res.data?.data;
};
