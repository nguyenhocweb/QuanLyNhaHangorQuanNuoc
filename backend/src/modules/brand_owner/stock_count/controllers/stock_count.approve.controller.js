import { approveStockCountService } from "../services/stock_count.approve.service.js";

export const approveStockCount = async (req, res) => {
  const stockCountId = req.params.id;
  const userId = req.user.id; // Lấy từ middleware auth
  const { reason } = req.body;

  const result = await approveStockCountService(stockCountId, userId, reason);

  res.status(200).json({
    message: "Phê duyệt phiếu kiểm kê thành công",
    metadata: result,
  });
};
