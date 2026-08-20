import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

export const getBranchInventorySchema = {
  name: "getBranchInventory",
  description: "Lấy danh sách tất cả các nguyên vật liệu hiện đang có trong tồn kho của chi nhánh. Trả về cả tên, số lượng, đơn vị, ngưỡng cảnh báo. Dành cho Quản lý.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      searchQuery: {
        type: SchemaType.STRING,
        description: "Từ khóa tìm kiếm tên nguyên liệu (nếu muốn tìm đích danh 1 món). Bỏ trống để lấy tất cả."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng nguyên liệu tối đa trả về để tránh quá tải AI (mặc định 50)."
      }
    }
  }
};

export const executeGetBranchInventory = async (args, context) => {
  try {
    const { searchQuery = "", limit = 50 } = args;
    const { restaurantId } = context;

    if (!restaurantId) return { error: "Không xác định được chi nhánh." };

    // Lấy tồn kho (select mỏng)
    const allStocks = await prisma.inventoryStock.findMany({
      where: {
        restaurantId
      },
      include: {
        inventoryItem: { 
          select: { 
            name: true, 
            sku: true, 
            baseUnit: true, 
            minStockLevel: true,
            supplier: { select: { name: true } }
          } 
        }
      }
    });

    let filtered = allStocks;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.inventoryItem?.name?.toLowerCase().includes(lowerQuery) || 
        s.inventoryItem?.sku?.toLowerCase().includes(lowerQuery)
      );
    }

    const paginated = filtered.slice(0, Math.min(limit, 100));

    const dto = paginated.map(s => ({
      itemId: s.inventoryItemId,
      name: s.inventoryItem?.name,
      sku: s.inventoryItem?.sku,
      currentQuantity: s.quantity,
      minRequired: s.inventoryItem?.minStockLevel || s.minStockLevel,
      unit: s.inventoryItem?.baseUnit,
      supplier: s.inventoryItem?.supplier?.name || "Không rõ"
    }));

    return { 
      data: dto, 
      count: dto.length, 
      totalInBranch: filtered.length,
      message: filtered.length > paginated.length ? `Chỉ hiển thị ${paginated.length} kết quả đầu tiên. Vui lòng tìm kiếm chi tiết hơn nếu không thấy món cần tìm.` : "Danh sách tồn kho." 
    };
  } catch (error) {
    console.error("[getBranchInventory] Error:", error.message);
    return { error: "Lỗi tải kho: " + error.message };
  }
};
