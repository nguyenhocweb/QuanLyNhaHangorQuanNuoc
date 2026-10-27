import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as updateService from "../services/web_author.update.service.js";

export const updateWebAuthor = asyncHandler(async (req, res) => {
  const result = await updateService.updateWebAuthor(req.params.id, req.body);

  res.status(200).json({
    message: "Cập nhật thông tin thành viên thành công",
    data: result
  });
});
