import axiosClient from "@/src/core/api/axios-instance";
import { UpdateAdminFeedbackPayload, IAdminWebFeedback } from "../type/web_feedback_admin.type";

export const updateAdminWebFeedbackService = async (
  id: string,
  payload: UpdateAdminFeedbackPayload
): Promise<{ data: IAdminWebFeedback }> => {
  return await axiosClient.patch(`/system-admin/web-feedback/${id}`, payload);
};

