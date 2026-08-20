import { updateStockCountService } from "../services/stock_counts.update.service.js";

export const stockCountUpdateController = {
  updateDraft: async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const result = await updateStockCountService.updateDraft(userId, id, data);

    res.status(200).json({
      message: "Cập nhật phiếu kiểm kê thành công",
      metadata: result
    });
  }
};
