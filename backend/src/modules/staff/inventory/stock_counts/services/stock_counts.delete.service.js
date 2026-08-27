import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";

export const deleteStockCountService = {
  deleteStockCount: async (userId, stockCountId, role) => {
    // 1. Kiểm tra phiếu tồn tại
    const stockCount = await prisma.stockCount.findUnique({
      where: { id: stockCountId }
    });

    if (!stockCount) throw new NotFoundError("Phiếu kiểm kê không tồn tại");

    // 2. Kiểm tra quyền
    // Quản lý nhà hàng được xóa phiếu DRAFT hoặc PENDING_APPROVAL
    if (role === "Quản lý nhà hàng") {
      if (stockCount.status !== "DRAFT" && stockCount.status !== "PENDING_APPROVAL") {
        throw new BadRequestError("Chỉ có thể xóa phiếu nháp hoặc đang chờ duyệt");
      }
      
      // Không được xóa phiếu do Quản lý thương hiệu tạo
      const creator = await prisma.user.findUnique({ where: { id: stockCount.createdBy } });
      if (creator && creator.role === "Quản lý thương hiệu") {
        throw new BadRequestError("Quản lý nhà hàng không có quyền xóa phiếu do Quản lý thương hiệu tạo");
      }
    } else {
      // Nếu là Nhân viên, chỉ được xóa phiếu DRAFT của chính mình
      if (stockCount.status !== "DRAFT") {
        throw new BadRequestError("Nhân viên chỉ có thể xóa bản nháp");
      }
      if (stockCount.createdBy !== userId) {
        throw new BadRequestError("Bạn không có quyền xóa phiếu này");
      }
    }

    // 3. Xoá transaction để đảm bảo an toàn
    return await prisma.$transaction(async (tx) => {
      // Xoá các items trước
      await tx.stockCountItem.deleteMany({
        where: { stockCountId: stockCountId }
      });

      // Xoá phiếu đếm kho
      const deletedStockCount = await tx.stockCount.delete({
        where: { id: stockCountId }
      });

      return deletedStockCount;
    });
  }
};
