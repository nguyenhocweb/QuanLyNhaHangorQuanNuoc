import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as getService from "../services/web_feedback.get.service.js";

export const getPublicFeedbacks = asyncHandler(async (req, res) => {
  const result = await getService.getPublicFeedbacks(req.query);

  res.status(200).json({
    message: "Lấy danh sách đánh giá công khai thành công",
    data: result
  });
});
