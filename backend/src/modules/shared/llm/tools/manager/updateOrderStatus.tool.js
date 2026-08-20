import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const updateOrderStatusSchema = {
  name: "updateOrderStatus",
  description: "Cập nhật trạng thái của đơn hàng (Order) ví dụ: chuyển sang COMPLETED hoặc CANCELLED.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      orderId: {
        type: SchemaType.STRING,
        description: "Mã đơn hàng (Order ID) cần cập nhật."
      },
      newStatus: {
        type: SchemaType.STRING,
        description: "Trạng thái mới (PENDING, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED)."
      }
    },
    required: ["orderId", "newStatus"]
  }
};

export const executeUpdateOrderStatus = async (args, context) => {
  try {
    const { orderId, newStatus } = args;
    const { restaurantId } = context;

    if (!restaurantId) return { error: "Không xác định được chi nhánh." };

    // Human-in-the-loop
    return { 
      needsUserConfirmation: true,
      actionType: "UPDATE_ORDER_STATUS",
      payload: {
        orderId,
        restaurantId, // Backend validation layer later checks this
        newStatus
      },
      message: `AI đề xuất chuyển trạng thái đơn hàng ${orderId.slice(-5)} sang ${newStatus}. Bạn có xác nhận không?`
    };

  } catch (error) {
    console.error("[updateOrderStatus] Error:", error.message);
    return { error: "Lỗi cập nhật trạng thái đơn hàng: " + error.message };
  }
};
