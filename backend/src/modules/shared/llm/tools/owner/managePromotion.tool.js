import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const managePromotionSchema = {
  name: "managePromotion",
  description: "Tạo một chiến dịch khuyến mãi mới cho thương hiệu. Dành cho Quản lý thương hiệu.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: {
        type: SchemaType.STRING,
        description: "Tên chiến dịch (vd: Khuyến mãi mùa hè)."
      },
      discountType: {
        type: SchemaType.STRING,
        description: "Loại giảm giá (PERCENTAGE hoặc FIXED_AMOUNT)."
      },
      discountValue: {
        type: SchemaType.INTEGER,
        description: "Giá trị giảm (vd: 10 cho 10%, hoặc 50000 cho 50k)."
      }
    },
    required: ["name", "discountType", "discountValue"]
  }
};

export const executeManagePromotion = async (args, context) => {
  try {
    const { name, discountType, discountValue } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    // Lược bỏ bớt code logic chi tiết, tập trung vào Human-in-the-loop
    return { 
      needsUserConfirmation: true,
      actionType: "CREATE_PROMOTION",
      payload: {
        brandId,
        name,
        discountType,
        discountValue,
        status: "DRAFT"
      },
      message: `AI đã thiết lập khuyến mãi "${name}" giảm ${discountValue} ${discountType === 'PERCENTAGE' ? '%' : 'VND'}. Xác nhận tạo?`
    };

  } catch (error) {
    console.error("[managePromotion] Error:", error.message);
    return { error: "Lỗi tạo khuyến mãi: " + error.message };
  }
};
