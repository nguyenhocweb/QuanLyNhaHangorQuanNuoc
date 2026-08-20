import { updatePurchaseOrderService } from "../services/purchase_order.update.service.js";

export const updatePurchaseOrderController = async (req, res) => {
  const { id } = req.params;
  const brandId = req.params.id_brand;
  const userId = req.user.id;
  const result = await updatePurchaseOrderService(id, req.body, brandId, userId);
  res.status(200).json({
    message: "Cập nhật đơn nhập hàng thành công",
    metadata: result,
  });
};
