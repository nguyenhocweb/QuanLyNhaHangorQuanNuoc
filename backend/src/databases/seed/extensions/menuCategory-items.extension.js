// extensions/categoriesAndItemsExtension.js
import { menuCategoriesData, menuItemsData } from "../constants/menucategory-items.data.js";
import { upsertVector } from "../../../modules/shared/vector/service/vectorDB.service.js";
import { embedText } from "../../../modules/shared/vector/service/embedding.service.js";
import { tableVector } from "../../../config/tableVector.js";
import { buildMenuItemVector } from "../../../modules/shared/vector/builders/menuItem.builder.js";
export const categoriesAndItemsExtension = async (prisma) => {
  console.log("Creating Menu Categories & Items...");

  // ==========================================
  // 1️⃣ SEEDING MENU CATEGORIES
  // ==========================================
  const categoryResult = await prisma.menuCategory.createMany({
    data: menuCategoriesData
  });
  console.log(`✅ Created ${categoryResult.count} menu categories`);

  // ==========================================
  // 2️⃣ SEEDING MENU ITEMS & RESTAURANT MAPS
  // ==========================================

  // Chuẩn bị dữ liệu cho MenuItem chuẩn Enterprise
  const mappedItems = menuItemsData.map((item, index) => {
    return {
      id: item.id,
      categoryId: item.categoryId,
      brandId: item.brandId,
      sku: `SKU-${item.id ? item.id.substring(18) : index}-${Date.now().toString().slice(-4)}`,
      name: item.name,
      description: item.description,
      image: item.image,
      images: item.images || [],
      basePrice: item.base_price || 0,
      item_type: item.item_type,
      allergens: item.allergens || [],
      spice_level: item.spice_level,
      prep_time: item.prep_time,
      isActive: item.is_available ?? true,
      is_featured: item.is_featured ?? false,
      sort_order: item.sort_order ?? 0,
    };
  });

  const itemResult = await prisma.menuItem.createMany({
    data: mappedItems
  });

  // Chuẩn bị dữ liệu Phân phối cho RestaurantMenuItem
  const restaurantMaps = menuItemsData
    .filter(item => item.restaurantId)
    .map(item => ({
      restaurantId: item.restaurantId,
      menuItemId: item.id,
      isAvailable: item.is_available ?? true,
      overridePrice: null // Khởi tạo chưa ghi đè giá
    }));

  if (restaurantMaps.length > 0) {
    const rmResult = await prisma.restaurantMenuItem.createMany({
      data: restaurantMaps
    });
    console.log(`✅ Distributed ${rmResult.count} items to restaurants`);
  }

  // ==========================================
  // 3️⃣ CẬP NHẬT VECTOR DB CHO AI SEARCH
  // ==========================================
  for (const item of menuItemsData) {
    const text = [
        `Món ăn: ${item.name || "Món ăn ẩn danh"} là 1 món ăn.`,
        ` ${item.restaurantName? `món ăn này thuộc nhà hàng: ${item.restaurantName}`:""}. `,
        `${item.brandName?`món ăn này thuộc thương hiệu: ${item.brandName}`:""}.`,
        
        ` Giá cơ bản: ${item.base_price || 0}.`,
        ` Phần trăm giảm giá: ${item.discount_percent??0}%`,
        ` hạn ngày hết giảm giá: ${item.discount_until??"Không có thông tin"}`,
         item.is_featured?"là món hot":"",
        ` Menu: ${item.menuName|| "chưa cập nhật danh mục"}.`,
        ` Danh mục: ${item.categoryName || "chưa cập nhật danh mục"}.`,
       
        ` Mô tả: ${item.description || "chưa cập nhật mô tả"}.`,
        ` thành phần món ăn gồm: ${item.allergens ? item.allergens.join(", ") : "Không có thông tin"}. `,
      
    ].join(" ");
    const embedding = await embedText(text);
    const MenuItemVector = buildMenuItemVector({
      id: `menuItem_${item.id}`,
      name: item.name,
      description: item.description,
      allergens: item.allergens,
      embedding: embedding,

      basePrice: item.base_price || 0, // Dùng schema mới
      brandName:item.brandName,
      menuName:item.menuName,
      restaurantName: item.restaurantName,
      categoryName: item.categoryName
    });
     await upsertVector(MenuItemVector, tableVector.menu);
  
    
    
  }
  console.log(`✅ Created ${itemResult.count} menu items`);
};