import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as getService from "../services/web_feedback.get.service.js";

export const getAdminFeedbacks = asyncHandler(async (req, res) => {
  const result = await getService.getAdminFeedbacks(req.query);

  res.status(200).json({
    message: "Lấy danh sách đánh giá quản trị thành công",
    data: result
  });
});
