import { updateAccountService } from "../services/account.update.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const updateAccountController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await updateAccountService(id, payload);

  return res.status(200).json({
    message: "Cập nhật tài khoản thành công",
    data: result
  });
});
