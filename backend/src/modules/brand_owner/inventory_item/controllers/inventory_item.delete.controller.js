import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteInventoryItemService } from "../services/inventory_item.delete.service.js";

export const deleteInventoryItemController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const { itemId } = req.params;
  await deleteInventoryItemService(itemId, brandId);
  res.status(200).json({
    message: "Xóa hàng hóa thành công",
    metadata: null
  });
});
