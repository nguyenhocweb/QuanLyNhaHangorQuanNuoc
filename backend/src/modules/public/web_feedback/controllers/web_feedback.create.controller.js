import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as createService from "../services/web_feedback.create.service.js";

export const createWebFeedback = asyncHandler(async (req, res) => {
  const clientMetadata = {
    userId: req.user?.id || null,
    ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress || null,
    userAgent: req.headers["user-agent"] || null
  };

  const result = await createService.createWebFeedback(req.body, clientMetadata);

  res.status(201).json({
    message: "Cảm ơn bạn đã gửi nhận xét góp ý! Đánh giá sẽ được kiểm duyệt trước khi hiển thị.",
    data: {
      id: result.id,
      rating: result.rating,
      category: result.category,
      createdAt: result.createdAt
    }
  });
});
