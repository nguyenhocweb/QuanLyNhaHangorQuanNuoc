import { useQuery } from "@tanstack/react-query";
import { getPublicFeedbacksService, GetPublicFeedbacksParams } from "../service/web_feedback.get.service";

export const useGetPublicWebFeedbacks = (params: GetPublicFeedbacksParams = {}) => {
  return useQuery({
    queryKey: ["PUBLIC_WEB_FEEDBACKS", params],
    queryFn: () => getPublicFeedbacksService(params),
    staleTime: 60 * 1000
  });
};
