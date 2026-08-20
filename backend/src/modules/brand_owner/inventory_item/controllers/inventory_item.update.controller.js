import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { updateInventoryItemService } from "../services/inventory_item.update.service.js";

export const updateInventoryItemController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const { itemId } = req.params;
  const item = await updateInventoryItemService(itemId, req.body, brandId);
  res.status(200).json({
    message: "Cập nhật hàng hóa thành công",
    metadata: item
  });
});
