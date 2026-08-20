import { 
    generateMenus, 
    generateMenuCategories, 
    generateMenuCategoryMaps, 
    generateMenuItems, 
    generateItemCategoryMaps, 
    generateItemVariants, 
    generateModifierGroups, 
    generateModifierOptions, 
    generateRestaurantMenuItems 
} from "../constants/menucategory-items.data.js";
import brandData from "../constants/brand.data.js";
import restaurantData from "../constants/restaurant.data.js";
import { upsertVector } from "../../../modules/shared/vector/service/vectorDB.service.js";
import { embedText } from "../../../modules/shared/vector/service/embedding.service.js";
import { tableVector } from "../../../config/tableVector.js";
import { buildMenuItemVector } from "../../../modules/shared/vector/core_builders/menuItem.builder.js";

export const categoriesAndItemsExtension = async (prisma) => {
    console.log("Creating Menus, Categories, Items, Variants & Modifiers...");

    // 1. Menus
    const menus = generateMenus(brandData);
    const menuResult = await prisma.menu.createMany({ data: menus });
    console.log(`✅ Created ${menuResult.count} menus`);

    // 2. MenuCategories
    const categories = generateMenuCategories(brandData);
    const catResult = await prisma.menuCategory.createMany({ data: categories });
    console.log(`✅ Created ${catResult.count} menu categories`);

    // 3. MenuCategoryMaps
    const menuCatMaps = generateMenuCategoryMaps(menus, categories);
    const menuCatMapResult = await prisma.menuCategoryMap.createMany({ data: menuCatMaps });
    console.log(`✅ Created ${menuCatMapResult.count} menu category maps`);

    // 4. MenuItems
    const items = generateMenuItems(brandData);
    const itemResult = await prisma.menuItem.createMany({ data: items });
    console.log(`✅ Created ${itemResult.count} menu items`);

    // 5. ItemCategoryMaps
    const itemCatMaps = generateItemCategoryMaps(items, categories);
    const itemCatMapResult = await prisma.itemCategoryMap.createMany({ data: itemCatMaps });
    console.log(`✅ Created ${itemCatMapResult.count} item category maps`);

    // 6. ItemVariants
    const variants = generateItemVariants(items);
    const varResult = await prisma.itemVariant.createMany({ data: variants });
    console.log(`✅ Created ${varResult.count} item variants`);

    // 7. ModifierGroups
    const modifierGroups = generateModifierGroups(items);
    const modGroupResult = await prisma.modifierGroup.createMany({ data: modifierGroups });
    console.log(`✅ Created ${modGroupResult.count} modifier groups`);

    // 8. ModifierOptions
    const modifierOptions = generateModifierOptions(modifierGroups);
    const modOptResult = await prisma.modifierOption.createMany({ data: modifierOptions });
    console.log(`✅ Created ${modOptResult.count} modifier options`);

    // 9. RestaurantMenuItems (Distribution)
    const restaurantMenuItems = generateRestaurantMenuItems(restaurantData, items);
    const rmResult = await prisma.restaurantMenuItem.createMany({ data: restaurantMenuItems });
    console.log(`✅ Distributed ${rmResult.count} items to restaurants`);

    // ==========================================
    // 10. CẬP NHẬT VECTOR DB CHO AI SEARCH (GIỚI HẠN)
    // ==========================================
    const LIMIT_VECTOR_SEED = 50; 
    console.log(`⏳ Embedding vectors for the first ${LIMIT_VECTOR_SEED} items to save API quota...`);
    
    let vectorCount = 0;
    for (const item of items) {
        if (vectorCount >= LIMIT_VECTOR_SEED) break;

        // Fetch brand Name & category name (giả lập vì array data chỉ có id)
        const brand = brandData.find(b => b.id === item.brandId);
        const itemMap = itemCatMaps.find(m => m.menuItemId === item.id);
        const category = categories.find(c => c.id === itemMap.categoryId);

        const text = [
            `Món ăn: ${item.name} là 1 món ăn.`,
            `món ăn này thuộc thương hiệu: ${brand ? brand.name : ""}.`,
            `Giá cơ bản: ${item.basePrice}.`,
            item.is_featured ? "là món hot" : "",
            `Danh mục: ${category ? category.name : "chưa cập nhật"}.`,
            `Mô tả: ${item.description}.`,
            `thành phần: ${item.allergens.length ? item.allergens.join(", ") : "Không có thông tin"}.`
        ].join(" ");

        try {
            const embedding = await embedText(text);
            const MenuItemVector = buildMenuItemVector({
                id: `menuItem_${item.id}`,
                name: item.name,
                description: item.description,
                allergens: item.allergens,
                embedding: embedding,
                basePrice: item.basePrice,
                brandName: brand ? brand.name : null,
                categoryName: category ? category.name : null
            });
            await upsertVector(MenuItemVector, tableVector.menu);
            vectorCount++;
        } catch (error) {
            console.error(`❌ Lỗi khi vectorise item ${item.id}:`, error.message);
        }
    }
    console.log(`✅ Đã đẩy thành công ${vectorCount} vectors lên Pinecone!`);
};
