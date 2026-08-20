import { createPurchaseOrderService } from "../services/purchase_order.create.service.js";

export const createPurchaseOrderController = async (req, res) => {
  const brandId = req.params.id_brand;
  const userId = req.user.id;
  const data = { ...req.body, brandId };
  const result = await createPurchaseOrderService(data, userId);
  res.status(201).json({
    message: "Tạo đơn nhập hàng thành công",
    metadata: result,
  });
};
