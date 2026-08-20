import { SchemaType } from "@google/generative-ai";
import { prisma } from "../../../../../databases/init.mongodb.js";

// Bắt buộc khai báo Schema cho Gemini hiểu
export const getPublicMenuSchema = {
  name: "getPublicMenu",
  description: "Lấy danh sách các món ăn (Menu) đang hoạt động tại nhà hàng mà khách đang xem. Bắt buộc dùng khi khách hàng hỏi về món ăn, giá cả, thực đơn.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      categoryName: {
        type: SchemaType.STRING,
        description: "Tên danh mục món ăn muốn lọc. Chỉ dùng khi khách hỏi về một NHÓM món (vd: cho xem menu nước). KHÔNG DÙNG tham số này nếu khách hỏi một món ăn cụ thể."
      },
      searchQuery: {
        type: SchemaType.STRING,
        description: "Tên món ăn cụ thể muốn tìm kiếm (vd: Trà sữa trân châu, Pizza). Dùng tham số này khi khách hỏi thông tin về 1 món ăn chi tiết."
      },
      limit: {
        type: SchemaType.INTEGER,
        description: "Số lượng món ăn tối đa cần lấy. (Mặc định 10)"
      }
    }
  }
};

// Executor: Hàm thực thi kết nối Database
export const executeGetPublicMenu = async (args, context) => {
  try {
    const { categoryName, searchQuery, limit = 10 } = args;
    const { restaurantId } = context;

    if (!restaurantId) {
      return { error: "Không xác định được nhà hàng khách đang xem." };
    }

    const whereClause = {
      isActive: true,
      restaurantMaps: {
        some: {
          restaurantId: restaurantId,
          isAvailable: true
        }
      }
    };

    if (categoryName) {
      whereClause.categoryMaps = {
        some: {
          category: {
            name: { contains: categoryName, mode: 'insensitive' }
          }
        }
      };
    }

    if (searchQuery) {
      whereClause.name = { contains: searchQuery, mode: 'insensitive' };
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      take: Math.min(limit, 20), // Hard limit chống tràn Token
      include: {
        categoryMaps: {
          include: { category: true }
        },
        modifierGroups: {
          include: { options: true }
        },
        variants: true,
        restaurantMaps: {
          where: { restaurantId: restaurantId }
        }
      },
      orderBy: { basePrice: 'asc' }
    });

    // DTO Mapper: Lược bỏ các trường dư thừa để tiết kiệm Token Context
    const dto = items.map(item => {
      const price = item.restaurantMaps[0]?.overridePrice ?? item.basePrice;
      
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: price,
        category: item.categoryMaps?.[0]?.category?.name || null,
        sizes: item.variants?.map(v => `${v.name}: ${v.price}`) || [],
        toppings_and_options: item.modifierGroups?.map(mg => {
          const options = mg.options.map(opt => `${opt.name} (+${opt.priceExtra})`).join(', ');
          return `${mg.name} (${options})`;
        }) || []
      };
    });

    return { data: dto, count: dto.length };
  } catch (error) {
    console.error("[getPublicMenu] Error:", error.message);
    return { error: "Có lỗi khi tải Menu: " + error.message };
  }
};
