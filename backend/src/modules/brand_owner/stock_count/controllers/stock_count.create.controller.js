import { createStockCountService } from "../services/stock_count.create.service.js";

export const createStockCountController = {
  create: async (req, res) => {
    const userId = req.user.id;
    const brandId = req.params.id_brand;
    const data = req.body;
    const result = await createStockCountService({ ...data, brandId, createdBy: userId });
    res.status(201).json({ message: "Tạo phiếu kiểm kho thành công", metadata: result });
  }
};
