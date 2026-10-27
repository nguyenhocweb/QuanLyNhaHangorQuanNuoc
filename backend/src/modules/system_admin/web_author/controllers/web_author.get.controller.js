import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as getService from "../services/web_author.get.service.js";

export const getAdminAuthors = asyncHandler(async (req, res) => {
  const result = await getService.getAdminAuthors();

  res.status(200).json({
    message: "Lấy danh sách thành viên phát triển thành công",
    data: result
  });
});

export const getAuthorById = asyncHandler(async (req, res) => {
  const result = await getService.getAuthorById(req.params.id);

  res.status(200).json({
    message: "Lấy chi tiết thành viên thành công",
    data: result
  });
});
