import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as updateService from "../services/web_feedback.update.service.js";

export const updateFeedback = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const result = await updateService.updateFeedback(req.params.id, req.body, adminId);

  res.status(200).json({
    message: "Cập nhật trạng thái nhận xét thành công",
    data: result
  });
});
