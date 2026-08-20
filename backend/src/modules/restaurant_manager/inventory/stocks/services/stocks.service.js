import { prisma } from "../../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../../core/constants/error/index.js";

export const managerStocksService = {
  getStocks: async (restaurantId, filter = {}, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const where = { restaurantId, ...filter };

    const [stocks, totalCount] = await prisma.$transaction([
      prisma.inventoryStock.findMany({
        where,
        skip,
        take: limit,
        include: {
          inventoryItem: true
        }
      }),
      prisma.inventoryStock.count({ where })
    ]);

    return {
      stocks,
      options: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  },

  addStockItem: async (restaurantId, inventoryItemId) => {
    // 1. Kiểm tra inventoryItemId có thuộc brand của restaurant này không
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    if (!restaurant) throw new BadRequestError("Không tìm thấy chi nhánh");

    const item = await prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, brandId: restaurant.brandId }
    });
    if (!item) throw new BadRequestError("Mặt hàng không tồn tại hoặc không thuộc thương hiệu này");

    // 2. Kiểm tra xem đã có trong tồn kho chưa
    const existingStock = await prisma.inventoryStock.findFirst({
      where: { restaurantId, inventoryItemId }
    });
    if (existingStock) throw new BadRequestError("Mặt hàng này đã có trong danh sách tồn kho");

    // 3. Thêm vào tồn kho với số lượng 0
    return await prisma.inventoryStock.create({
      data: {
        restaurantId,
        inventoryItemId,
        quantity: 0
      },
      include: {
        inventoryItem: true
      }
    });
  },

  getMasterItems: async (restaurantId) => {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { brandId: true }
    });
    if (!restaurant) throw new BadRequestError("Không tìm thấy nhà hàng");

    const items = await prisma.inventoryItem.findMany({
      where: { brandId: restaurant.brandId },
      select: {
        id: true,
        sku: true,
        name: true,
        baseUnit: true,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });
    
    return { items };
  }
};
