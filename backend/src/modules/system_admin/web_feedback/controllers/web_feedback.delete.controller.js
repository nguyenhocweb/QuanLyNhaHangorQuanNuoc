import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as deleteService from "../services/web_feedback.delete.service.js";

export const deleteFeedback = asyncHandler(async (req, res) => {
  await deleteService.deleteFeedback(req.params.id);

  res.status(200).json({
    message: "Xóa nhận xét thành công"
  });
});
