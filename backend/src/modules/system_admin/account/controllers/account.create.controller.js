import { createAccountService } from "../services/account.create.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const createAccountController = asyncHandler(async (req, res, next) => {
  const payload = req.body;

  const result = await createAccountService(payload);

  return res.status(201).json({
    message: "Tạo tài khoản mới thành công",
    data: result
  });
});
