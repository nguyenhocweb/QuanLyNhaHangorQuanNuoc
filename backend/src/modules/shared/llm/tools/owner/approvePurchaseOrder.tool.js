import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const approvePurchaseOrderSchema = {
  name: "approvePurchaseOrder",
  description: "Duyệt Phiếu yêu cầu nhập hàng (Purchase Order) do Quản lý nhà hàng gửi lên. Dành cho Quản lý thương hiệu.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      orderId: {
        type: SchemaType.STRING,
        description: "Mã phiếu yêu cầu (Purchase Order ID)."
      },
      action: {
        type: SchemaType.STRING,
        description: "Hành động: APPROVE (Duyệt) hoặc REJECT (Từ chối)."
      }
    },
    required: ["orderId", "action"]
  }
};

export const executeApprovePurchaseOrder = async (args, context) => {
  try {
    const { orderId, action } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    if (!["APPROVE", "REJECT"].includes(action.toUpperCase())) {
      return { error: "Action không hợp lệ. Phải là APPROVE hoặc REJECT." };
    }

    const newStatus = action.toUpperCase() === "APPROVE" ? "APPROVED" : "REJECTED";

    // Human-in-the-loop: Yêu cầu xác nhận từ Owner
    return { 
      needsUserConfirmation: true,
      actionType: "APPROVE_PURCHASE_ORDER",
      payload: {
        orderId,
        brandId,
        status: newStatus
      },
      message: `AI đề xuất ${newStatus === "APPROVED" ? "DUYỆT" : "TỪ CHỐI"} phiếu nhập hàng ${orderId.slice(-5)}. Bạn có đồng ý không?`
    };

  } catch (error) {
    console.error("[approvePurchaseOrder] Error:", error.message);
    return { error: "Lỗi xử lý phiếu nhập hàng: " + error.message };
  }
};
