import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { createInventoryItemService } from "../services/inventory_item.create.service.js";

export const createInventoryItemController = asyncHandler(async (req, res) => {
  const brandId = req.params.id_brand;
  const data = { ...req.body, brandId };
  const item = await createInventoryItemService(data);
  res.status(201).json({
    message: "Tạo hàng hóa thành công",
    metadata: item
  });
});
