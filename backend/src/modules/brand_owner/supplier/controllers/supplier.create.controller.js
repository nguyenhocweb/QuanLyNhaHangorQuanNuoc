import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createSupplierService } from "../services/supplier.create.service.js";

export const createSupplierController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const data = { ...req.body, brandId };
  const supplier = await createSupplierService(data);
  res.status(201).json({
    message: "Tạo nhà cung cấp thành công",
    metadata: supplier
  });
});
