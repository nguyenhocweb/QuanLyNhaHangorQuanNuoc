import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getLowStockAlertsSchema = {
  name: "getLowStockAlerts",
  description: "Lấy danh sách các nguyên vật liệu trong kho đang ở mức thấp (cần nhập thêm hàng). Dành cho Quản lý.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng nguyên liệu tối đa (mặc định 10)."
      }
    }
  }
};

export const executeGetLowStockAlerts = async (args, context) => {
  try {
    const { limit = 10 } = args;
    const { restaurantId } = context;

    if (!restaurantId) return { error: "Không xác định được chi nhánh." };

    // Tìm các mặt hàng trong kho có quantity < minStockLevel
    const lowStocks = await prisma.inventoryStock.findMany({
      where: {
        restaurantId,
        // Prisma MongoDB ko hỗ trợ trực tiếp so sánh 2 cột trong where, nên ta filter bằng code hoặc query raw.
        // Tạm thời kéo về 100 record đầu để filter bằng code (vì MongoDB prisma hạn chế query so sánh trường)
      },
      include: {
        inventoryItem: { select: { name: true, sku: true, baseUnit: true, minStockLevel: true } }
      }
    });

    const filtered = lowStocks
      .filter(s => s.quantity <= (s.inventoryItem?.minStockLevel || s.minStockLevel || 0))
      .slice(0, Math.min(limit, 20));

    const dto = filtered.map(s => ({
      itemId: s.inventoryItemId,
      name: s.inventoryItem?.name,
      sku: s.inventoryItem?.sku,
      currentQuantity: s.quantity,
      minRequired: s.inventoryItem?.minStockLevel || s.minStockLevel,
      unit: s.inventoryItem?.baseUnit
    }));

    return { data: dto, count: dto.length, message: dto.length > 0 ? "Có nguyên liệu sắp hết." : "Kho vẫn đủ." };
  } catch (error) {
    console.error("[getLowStockAlerts] Error:", error.message);
    return { error: "Lỗi tải kho: " + error.message };
  }
};
