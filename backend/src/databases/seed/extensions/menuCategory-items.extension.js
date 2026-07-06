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
  
  // Lấy danh sách Menu để map ID

  // Tạo Categories
  const categoryResult = await prisma.menuCategory.createMany({
    data: menuCategoriesData
  });

  console.log(`✅ Created ${categoryResult.count} menu categories`);

  // ==========================================
  // 2️⃣ SEEDING MENU ITEMS
  // ==========================================

  // Lấy các dữ liệu tham chiếu cần thiết
  


  // Xử lý và map dữ liệu Items



  const itemResult = await prisma.menuItem.createMany({
    data: menuItemsData.map(({brandName,restaurantName,menuName,categoryName,...e})=>e)
  });
 
  // Tạo vector cho từng item
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

      base_price: item.base_price,
      brandName:item.brandName,
      menuName:item.menuName,
      restaurantName: item.restaurantName,
      categoryName: item.categoryName
    });
     await upsertVector(MenuItemVector, tableVector.menu);
  
    
    
  }
  console.log(`✅ Created ${itemResult.count} menu items`);
};