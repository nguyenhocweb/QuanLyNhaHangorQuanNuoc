import { deletePurchaseOrderService } from "../services/purchase_order.delete.service.js";

export const deletePurchaseOrderController = async (req, res) => {
  const { id } = req.params;
  const brandId = req.params.id_brand;
  const result = await deletePurchaseOrderService(id, brandId);
  res.status(200).json({
    message: "Xóa đơn nhập hàng thành công",
    metadata: result,
  });
};
