import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as getService from "../services/web_author.get.service.js";

export const getPublicAuthors = asyncHandler(async (req, res) => {
  const result = await getService.getPublicAuthors();

  res.status(200).json({
    message: "Lấy danh sách đội ngũ phát triển thành công",
    data: result
  });
});
