import * as createRepo from "../repositories/web_feedback.create.repo.js";
import { FeedbackStatus } from "../../../../databases/prisma/generated/prisma/index.js";

export const createWebFeedback = async (data, clientMetadata = {}) => {
  const payload = {
    rating: data.rating,
    content: data.content,
    title: data.title || null,
    category: data.category,
    guestName: data.guestName || "Khách ẩn danh",
    guestEmail: data.guestEmail || null,
    guestPhone: data.guestPhone || null,
    pageUrl: data.pageUrl || null,
    deviceInfo: data.deviceInfo || null,
    screenResolution: data.screenResolution || null,
    attachments: data.attachments || [],
    status: FeedbackStatus.PENDING,
    isGuest: !clientMetadata.userId,
    userId: clientMetadata.userId || null,
    ipAddress: clientMetadata.ipAddress || null,
    userAgent: clientMetadata.userAgent || null
  };

  return await createRepo.createWebFeedback(payload);
};
