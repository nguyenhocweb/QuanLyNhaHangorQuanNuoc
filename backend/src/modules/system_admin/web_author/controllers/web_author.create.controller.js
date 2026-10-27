import asyncHandler from "../../../../core/utils/asyncHandler.js";
import * as createService from "../services/web_author.create.service.js";

export const createWebAuthor = asyncHandler(async (req, res) => {
  const result = await createService.createWebAuthor(req.body);

  res.status(201).json({
    message: "Thêm thành viên phát triển thành công",
    data: result
  });
});
