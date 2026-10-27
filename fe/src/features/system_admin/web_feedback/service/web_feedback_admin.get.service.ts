import axiosClient from "@/src/core/api/axios-instance";
import { IAdminFeedbacksResponse, GetAdminFeedbacksParams } from "../type/web_feedback_admin.type";

export const getAdminWebFeedbacksService = async (params: GetAdminFeedbacksParams = {}): Promise<IAdminFeedbacksResponse> => {
  const res = await axiosClient.get("/system-admin/web-feedback", { params });
  return res.data?.data;
};
