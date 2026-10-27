import axiosClient from "@/src/core/api/axios-instance";
import { CreateWebFeedbackFormValues } from "../schema/web_feedback.create.schema";

export const createWebFeedbackService = async (data: CreateWebFeedbackFormValues) => {
  return await axiosClient.post("/public/web-feedback", data);
};

