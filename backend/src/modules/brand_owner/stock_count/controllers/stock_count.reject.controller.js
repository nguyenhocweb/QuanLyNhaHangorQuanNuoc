import { rejectStockCountService } from "../services/stock_count.reject.service.js";

export const rejectStockCount = async (req, res) => {
  const stockCountId = req.params.id;
  const userId = req.user.id;
  const { reason } = req.body;

  const result = await rejectStockCountService(stockCountId, userId, reason);

  res.status(200).json({
    message: "Từ chối phiếu kiểm kê thành công",
    metadata: result,
  });
};
