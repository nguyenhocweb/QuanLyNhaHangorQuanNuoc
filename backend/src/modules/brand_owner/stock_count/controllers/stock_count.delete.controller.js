import { deleteStockCountService } from "../services/stock_count.delete.service.js";

export const deleteStockCountController = {
  deleteStockCount: async (req, res) => {
    const { id } = req.params;
    await deleteStockCountService(id);
    res.status(200).json({ message: "Xóa thành công" });
  }
};
