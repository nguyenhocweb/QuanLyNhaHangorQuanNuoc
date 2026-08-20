import { generatePurchaseOrdersService } from "../services/request.generate.service.js";

export const generatePurchaseOrders = async (req, res) => {
  const brandId = req.params.id_brand;
  const userId = req.user.id;
  const { centralWarehouseId, groups } = req.body;
  
  const result = await generatePurchaseOrdersService(brandId, userId, centralWarehouseId, groups);

  return res.status(201).json({
    message: "Tạo Hóa đơn (PO) thành công từ Yêu cầu nhập kho",
    metadata: result
  });
};
