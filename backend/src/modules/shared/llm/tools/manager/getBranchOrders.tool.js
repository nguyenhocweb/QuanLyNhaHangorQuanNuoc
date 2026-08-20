import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getBranchOrdersSchema = {
  name: "getBranchOrders",
  description: "Lấy danh sách các đơn hàng của chi nhánh (nhà hàng) hiện tại. Chỉ dùng cho Quản lý.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      status: {
        type: SchemaType.STRING,
        description: "Lọc theo trạng thái đơn hàng (vd: PENDING, COMPLETED, CANCELLED). Để trống để lấy tất cả."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng đơn hàng tối đa. (Mặc định 10)"
      }
    }
  }
};

export const executeGetBranchOrders = async (args, context) => {
  try {
    const { status, limit = 10 } = args;
    const { restaurantId } = context; // Bảo mật: Manager chỉ xem được đơn của chi nhánh mình

    if (!restaurantId) return { error: "Không xác định được chi nhánh quản lý." };

    const whereClause = { restaurantId };
    if (status) whereClause.status = status;

    const orders = await prisma.order.findMany({
      where: whereClause,
      take: Math.min(limit, 20),
      include: {
        customer: { select: { user_name: true, phone: true } },
        table: { select: { tableNumber: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const dto = orders.map(o => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      customerName: o.customer?.user_name || "Khách lẻ",
      tableNumber: o.table?.tableNumber || "Mang đi",
      createdAt: o.createdAt
    }));

    return { data: dto, count: dto.length };
  } catch (error) {
    console.error("[getBranchOrders] Error:", error.message);
    return { error: "Lỗi tải đơn hàng: " + error.message };
  }
};
