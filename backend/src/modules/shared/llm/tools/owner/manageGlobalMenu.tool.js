import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const manageGlobalMenuSchema = {
  name: "manageGlobalMenu",
  description: "Cập nhật giá bán hoặc trạng thái của một món ăn trên toàn hệ thống Thương hiệu (Global). Dành cho Quản lý thương hiệu.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      menuItemId: {
        type: SchemaType.STRING,
        description: "Mã món ăn (Menu Item ID)."
      },
      newPrice: {
        type: SchemaType.INTEGER,
        description: "Giá bán mới (VND)."
      }
    },
    required: ["menuItemId", "newPrice"]
  }
};

export const executeManageGlobalMenu = async (args, context) => {
  try {
    const { menuItemId, newPrice } = args;
    const { brandId } = context;

    if (!brandId) return { error: "Không xác định được thương hiệu." };

    // Tìm món ăn để xác nhận tên
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return { error: "Không tìm thấy món ăn trong hệ thống." };
    }

    // Human-in-the-loop
    return { 
      needsUserConfirmation: true,
      actionType: "UPDATE_GLOBAL_MENU_PRICE",
      payload: {
        menuItemId,
        brandId,
        newPrice
      },
      message: `AI đề xuất đổi giá món "${menuItem.name}" thành ${newPrice.toLocaleString()} VND trên toàn hệ thống. Xác nhận đổi giá?`
    };

  } catch (error) {
    console.error("[manageGlobalMenu] Error:", error.message);
    return { error: "Lỗi cập nhật giá món ăn: " + error.message };
  }
};
