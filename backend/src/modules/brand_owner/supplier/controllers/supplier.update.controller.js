import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { updateSupplierService } from "../services/supplier.update.service.js";

export const updateSupplierController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const { supplierId } = req.params;
  const supplier = await updateSupplierService(supplierId, req.body, brandId);
  res.status(200).json({
    message: "Cập nhật nhà cung cấp thành công",
    metadata: supplier
  });
});
