import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const createReservationSchema = {
  name: "createReservation",
  description: "Đặt bàn trước tại nhà hàng. Chỉ gọi khi khách hàng cung cấp đủ ngày giờ, số người và thông tin đặt bàn.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      reservationTime: {
        type: SchemaType.STRING,
        description: "Ngày giờ đặt bàn, định dạng ISO 8601 (VD: 2026-10-15T19:00:00Z)"
      },
      partySize: {
        type: SchemaType.INTEGER,
        description: "Số lượng khách tham gia"
      },
      specialRequests: {
        type: SchemaType.STRING,
        description: "Yêu cầu đặc biệt (ví dụ: ghế trẻ em, sinh nhật)"
      }
    },
    required: ["reservationTime", "partySize"]
  }
};

export const executeCreateReservation = async (args, context) => {
  try {
    const { reservationTime, partySize, specialRequests } = args;
    const { restaurantId, userId } = context;

    if (!restaurantId || !userId) {
      return { error: "Thiếu thông tin người dùng hoặc nhà hàng để đặt bàn." };
    }

    // Ghi vào bảng Reservation
    const reservation = await prisma.reservation.create({
      data: {
        restaurantId,
        customerId: userId, // Bắt buộc lấy từ Token, không để AI truyền
        reservationTime: new Date(reservationTime),
        partySize,
        status: "PENDING",
        specialRequests
      }
    });

    return { 
      message: "Đặt bàn thành công, chờ nhà hàng xác nhận.", 
      reservationId: reservation.id 
    };
  } catch (error) {
    console.error("[createReservation] Error:", error.message);
    return { error: "Không thể đặt bàn lúc này: " + error.message };
  }
};
