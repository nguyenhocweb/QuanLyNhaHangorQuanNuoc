import { deleteStockCountService } from "../services/stock_counts.delete.service.js";

export const stockCountDeleteController = {
  deleteStockCount: async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    // req.user.role có thể được middleware lấy ra, nhưng để đơn giản ta lấy từ employment hoặc query nếu cần
    // Hiện tại middleware `authorizeRole` kiểm tra, ta có thể tạm lấy từ auth.
    // Thực tế trong hệ thống này, req.user có chứa roles (ví dụ: `role` từ bảng user)
    const role = req.user.role || "Nhân viên"; 

    const result = await deleteStockCountService.deleteStockCount(userId, id, role);

    res.status(200).json({
      message: "Xóa phiếu kiểm kê thành công",
      metadata: result
    });
  }
};
