import { useQuery } from "@tanstack/react-query";
import { getAdminWebFeedbacksService } from "../service/web_feedback_admin.get.service";
import { GetAdminFeedbacksParams } from "../type/web_feedback_admin.type";

export const useGetAdminWebFeedbacks = (params: GetAdminFeedbacksParams = {}) => {
  return useQuery({
    queryKey: ["ADMIN_WEB_FEEDBACKS", params],
    queryFn: () => getAdminWebFeedbacksService(params),
    staleTime: 60 * 1000
  });
};
