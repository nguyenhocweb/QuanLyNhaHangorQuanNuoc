import { prisma } from "../../../../databases/init.mongodb.js";

export const rejectStockCountRepo = async (stockCountId, userId, reason) => {
  const stockCount = await prisma.stockCount.findUnique({
    where: { id: stockCountId }
  });
  if (!stockCount) throw new Error("Không tìm thấy phiếu kiểm kê");
  if (stockCount.status === "APPROVED" || stockCount.status === "COMPLETED") throw new Error("Không thể từ chối phiếu đã được duyệt/hoàn tất");
  if (!reason) throw new Error("Vui lòng nhập lý do từ chối");

  return await prisma.stockCount.update({
    where: { id: stockCountId },
    data: {
      status: "REJECTED",
      approvedBy: userId,
      approvedAt: new Date(),
      reason: reason
    }
  });
};
