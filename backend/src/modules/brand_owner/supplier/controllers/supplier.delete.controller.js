import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { deleteSupplierService } from "../services/supplier.delete.service.js";

export const deleteSupplierController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const { supplierId } = req.params;
  await deleteSupplierService(supplierId, brandId);
  res.status(200).json({
    message: "Xóa nhà cung cấp thành công",
    metadata: null
  });
});
