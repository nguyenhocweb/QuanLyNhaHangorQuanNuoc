import { prisma } from "../../../../databases/init.mongodb.js";

export const createInventoryItemRepo = async (data) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Tạo hàng hóa
    const item = await tx.inventoryItem.create({ data });

    // 2. Lấy danh sách chi nhánh (restaurant) thuộc thương hiệu này
    const restaurants = await tx.restaurant.findMany({
      where: { brandId: data.brandId }
    });

    // 3. Nếu có chi nhánh, khởi tạo kho (tồn = 0) cho tất cả chi nhánh
    if (restaurants.length > 0) {
      const stockData = restaurants.map(r => ({
        inventoryItemId: item.id,
        restaurantId: r.id,
        quantity: 0
      }));
      
      await tx.inventoryStock.createMany({
        data: stockData
      });
    }

    return item;
  });
};
