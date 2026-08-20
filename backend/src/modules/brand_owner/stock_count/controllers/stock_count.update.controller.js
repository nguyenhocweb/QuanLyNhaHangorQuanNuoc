import { updateStockCountService } from "../services/stock_count.update.service.js";

export const updateStockCountController = {
  update: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const data = req.body;
    const result = await updateStockCountService(id, data, userId);
    res.status(200).json({ message: "Cập nhật thành công", metadata: result });
  }
};
