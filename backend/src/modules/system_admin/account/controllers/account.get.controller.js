import { getAccountsService } from "../services/account.get.service.js";
import asyncHandler from "../../../../core/utils/asyncHandler.js";

export const getAccountsController = asyncHandler(async (req, res, next) => {
  const { page, limit, search, role, status, dateFilter } = req.query;

  const result = await getAccountsService({
    page,
    limit,
    search,
    role,
    status,
    dateFilter
  });

  return res.status(200).json({
    message: "Lấy danh sách người dùng thành công",
    ...result
  });
});
