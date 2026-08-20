import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getBranchReservationsSchema = {
  name: "getBranchReservations",
  description: "Lấy danh sách khách hàng đặt bàn của chi nhánh. Có thể lọc theo trạng thái (PENDING, CONFIRMED, CANCELLED) hoặc ngày.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      status: {
        type: SchemaType.STRING,
        description: "Lọc theo trạng thái (PENDING, CONFIRMED, COMPLETED, CANCELLED). Để trống để lấy tất cả."
      },
      date: {
        type: SchemaType.STRING,
        description: "Ngày cần xem lịch đặt bàn (định dạng YYYY-MM-DD). Để trống để lấy hôm nay."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng kết quả tối đa (mặc định 10, tối đa 20)."
      }
    }
  }
};

export const executeGetBranchReservations = async (args, context) => {
  try {
    const { status, date, limit = 10 } = args;
    const { restaurantId } = context;

    if (!restaurantId) return { error: "Không xác định được chi nhánh quản lý." };

    const whereClause = { restaurantId };
    if (status) whereClause.status = status;

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      whereClause.reservationTime = { gte: startOfDay, lte: endOfDay };
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      take: Math.min(limit, 20),
      include: {
        customer: { select: { user_name: true, phone: true } }
      },
      orderBy: { reservationTime: 'asc' }
    });

    const dto = reservations.map(r => ({
      id: r.id,
      customerName: r.customer?.user_name || "Khách ẩn danh",
      phone: r.customer?.phone || "N/A",
      partySize: r.partySize,
      time: r.reservationTime,
      status: r.status,
      specialRequests: r.specialRequests
    }));

    return { data: dto, count: dto.length };
  } catch (error) {
    console.error("[getBranchReservations] Error:", error.message);
    return { error: "Lỗi tải đặt bàn: " + error.message };
  }
};
