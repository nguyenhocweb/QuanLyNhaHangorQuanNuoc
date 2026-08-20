import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const createPurchaseRequestSchema = {
  name: "createPurchaseRequest",
  description: "Tạo phiếu yêu cầu nhập hàng (Purchase Request) gửi lên Chủ thương hiệu (Owner). Chỉ dùng khi quản lý muốn xin mua thêm nguyên liệu.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      notes: {
        type: SchemaType.STRING,
        description: "Lý do hoặc ghi chú xin nhập hàng (vd: Chuẩn bị lễ 2/9 cần nhập thêm thịt bò)."
      },
      expectedDate: {
        type: SchemaType.STRING,
        description: "Ngày cần hàng về, định dạng YYYY-MM-DD."
      }
      // Lưu ý: Các item chi tiết sẽ do Frontend thêm vào sau qua giỏ hàng. AI chỉ tạo Header phiếu.
    },
    required: ["notes"]
  }
};

export const executeCreatePurchaseRequest = async (args, context) => {
  try {
    const { notes, expectedDate } = args;
    const { restaurantId, userId } = context;

    if (!restaurantId || !userId) return { error: "Không xác định được chi nhánh." };

    // Human-in-the-loop: Báo cho Frontend biết AI muốn thực thi lệnh WRITE
    return { 
      needsUserConfirmation: true, // Cờ bẫy (Flag)
      actionType: "CREATE_PURCHASE_REQUEST",
      payload: {
        restaurantId,
        requestedById: userId,
        notes,
        expectedDate: expectedDate ? new Date(expectedDate) : new Date(),
        status: "DRAFT"
      },
      message: "AI đã lập xong nháp Phiếu yêu cầu nhập hàng. Bạn có muốn chọn thêm nguyên liệu và Gửi đi không?"
    };

    /* 
      Lưu ý: Đoạn code thực thi DB (Prisma Create) sẽ KHÔNG chạy ở đây.
      Frontend sẽ nhận `needsUserConfirmation: true` và hiện Popup. 
      Khi User bấm OK, FE mới gọi API POST /api/v1/purchase-request với payload trên.
    */
  } catch (error) {
    console.error("[createPurchaseRequest] Error:", error.message);
    return { error: "Lỗi tạo phiếu yêu cầu: " + error.message };
  }
};
