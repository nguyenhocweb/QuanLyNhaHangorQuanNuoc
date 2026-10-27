import axiosClient from "@/src/core/api/axios-instance";

export const deleteAdminWebFeedbackService = async (id: string) => {
  return await axiosClient.delete(`/system-admin/web-feedback/${id}`);
};

