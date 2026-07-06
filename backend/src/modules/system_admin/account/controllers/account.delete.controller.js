import { deleteAccountService } from "../services/account.delete.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const deleteAccountController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await deleteAccountService(id);

  return res.status(200).json({
    message: "Xóa tài khoản thành công"
  });
});
