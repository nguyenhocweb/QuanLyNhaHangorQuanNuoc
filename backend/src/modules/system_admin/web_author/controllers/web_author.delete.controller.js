import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as deleteService from "../services/web_author.delete.service.js";

export const deleteWebAuthor = asyncHandler(async (req, res) => {
  await deleteService.deleteWebAuthor(req.params.id);

  res.status(200).json({
    message: "Xóa thành viên thành công"
  });
});
