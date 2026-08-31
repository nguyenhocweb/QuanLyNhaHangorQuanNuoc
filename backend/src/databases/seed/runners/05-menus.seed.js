import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 05: Khởi tạo Thực Đơn (Menus), Danh Mục (MenuCategories), Món Ăn (MenuItems),
 * Biến Thể (ItemVariants), Nhóm Tùy Chọn (ModifierGroups & Options), Khả Dụng Chi Nhánh (RestaurantMenuItems)
 * Tách biệt dữ liệu đọc trực tiếp từ /data/menus.json
 */
export const seedMenus = async () => {
    console.log("👉 [5/8] Khởi tạo Thực đơn, Danh mục món, Biến thể & Topping (từ data/menus.json)...");

    // 1. Đọc dữ liệu thực đơn từ data/menus.json
    const menusPath = new URL("../data/menus.json", import.meta.url);
    const sampleCategories = JSON.parse(fs.readFileSync(menusPath, "utf-8"));

    // 2. Tải danh sách Brands và Restaurants hiện có
    const [allBrands, allRestaurants, existingMenus] = await Promise.all([
        prisma.brand.findMany({
            where: { isActive: "ACTIVE" },
            select: { id: true, name: true }
        }),
        prisma.restaurant.findMany({
            select: { id: true, brandId: true, name: true }
        }),
        prisma.menu.findMany({
            select: { id: true, brandId: true, name: true }
        })
    ]);

    const menuBrandSet = new Set(existingMenus.map(m => m.brandId));

    // Gom restaurants theo brandId
    const restsByBrandId = new Map();
    for (const rest of allRestaurants) {
        if (!restsByBrandId.has(rest.brandId)) {
            restsByBrandId.set(rest.brandId, []);
        }
        restsByBrandId.get(rest.brandId).push(rest);
    }

    const brandsToSeed = allBrands.filter(b => !menuBrandSet.has(b.id));

    // Thực thi theo batch 5 brands song song để tối ưu tốc độ
    const batchSize = 5;
    let createdMenuCount = 0;
    let createdItemCount = 0;

    for (let i = 0; i < brandsToSeed.length; i += batchSize) {
        const batch = brandsToSeed.slice(i, i + batchSize);
        await Promise.all(batch.map(async (brand) => {
            // A. Tạo Menu chính của Brand
            const menu = await prisma.menu.create({
                data: {
                    brandId: brand.id,
                    name: `Thực Đơn Chính - ${brand.name}`,
                    type: "MAIN_MENU",
                    description: `Bảng thực đơn tiêu chuẩn áp dụng trên toàn chuỗi ẩm thực ${brand.name}`,
                    available_days: [0, 1, 2, 3, 4, 5, 6],
                    available_from: "10:00",
                    available_until: "23:00",
                    is_active: true,
                    sort_order: 1
                }
            });
            createdMenuCount++;

            const brandRests = restsByBrandId.get(brand.id) || [];

            // B. Tạo MenuCategory & MenuItem từ JSON
            for (const catData of sampleCategories) {
                const category = await prisma.menuCategory.create({
                    data: {
                        menuId: menu.id,
                        name: catData.category_name,
                        description: catData.description,
                        sort_order: catData.sort_order,
                        is_active: true
                    }
                });

                for (const itemData of catData.items) {
                    const menuItem = await prisma.menuItem.create({
                        data: {
                            categoryId: category.id,
                            brandId: brand.id,
                            name: itemData.name,
                            slug: `${itemData.slug}-${brand.id.slice(-6)}`,
                            description: `Món ăn hảo hạng được chế biến từ đầu bếp chuẩn quốc tế của ${brand.name}`,
                            image: itemData.image,
                            images: [itemData.image],
                            base_price: itemData.base_price,
                            discount_percent: itemData.is_featured ? 10.0 : null,
                            calories: itemData.calories,
                            prep_time: itemData.prep_time,
                            spice_level: itemData.spice_level,
                            is_available: true,
                            is_featured: itemData.is_featured,
                            dietary_tags: itemData.dietary_tags,
                            allergens: itemData.allergens,
                            sort_order: 1
                        }
                    });
                    createdItemCount++;

                    // C. Biến thể (Variants) nếu có trong JSON
                    if (itemData.variants && itemData.variants.length > 0) {
                        const variantsToInsert = itemData.variants.map(v => ({
                            menuItemId: menuItem.id,
                            name: v.name,
                            sku: `SKU_${menuItem.id.slice(-6)}_${v.sku_suffix}`,
                            price: v.price
                        }));
                        await prisma.itemVariant.createMany({
                            data: variantsToInsert
                        });
                    }

                    // D. Nhóm Tùy Chọn (Modifiers) nếu có trong JSON
                    if (itemData.modifiers) {
                        const modGroup = await prisma.modifierGroup.create({
                            data: {
                                menuItemId: menuItem.id,
                                name: itemData.modifiers.group_name,
                                minSelections: itemData.modifiers.min_selections,
                                maxSelections: itemData.modifiers.max_selections
                            }
                        });

                        const optionsToInsert = itemData.modifiers.options.map(opt => ({
                            modifierGroupId: modGroup.id,
                            name: opt.name,
                            priceExtra: opt.price_extra
                        }));

                        await prisma.modifierOption.createMany({
                            data: optionsToInsert
                        });
                    }

                    // E. Liên kết RestaurantMenuItem cho toàn bộ chi nhánh của Brand
                    const restMenuItems = brandRests.map(r => ({
                        restaurantId: r.id,
                        menuItemId: menuItem.id,
                        isAvailable: true,
                        overridePrice: null
                    }));

                    if (restMenuItems.length > 0) {
                        await prisma.restaurantMenuItem.createMany({
                            data: restMenuItems
                        });
                    }
                }
            }
        }));
    }

    console.log(`✅ Đã khởi tạo hoàn tất ${createdMenuCount} Thực đơn và ${createdItemCount} Món ăn chi tiết từ data/menus.json!`);
    return true;
};
