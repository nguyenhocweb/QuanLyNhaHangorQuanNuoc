import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getSuppliersService } from "../services/supplier.get.service.js";

export const getSuppliersController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const data = await getSuppliersService(brandId, page, limit);
  res.status(200).json({
    message: "Lấy danh sách nhà cung cấp thành công",
    metadata: data.items,
    options: data.options
  });
});
