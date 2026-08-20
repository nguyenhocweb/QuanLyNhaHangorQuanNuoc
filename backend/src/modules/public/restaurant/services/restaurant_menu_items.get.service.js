import { getPublicMenuItemsRepo } from "../repositories/restaurant_menu_items.get.repo.js";

export const getPublicMenuItemsService = async (restaurantId, query) => {
    const { total, items } = await getPublicMenuItemsRepo(restaurantId, query);
    
    // Map items để làm phẳng structure
    const mappedData = items.map(item => {
        let menuName = "";
        let categoryName = "";
        
        if (item.categoryMaps && item.categoryMaps.length > 0) {
            categoryName = item.categoryMaps[0].category.name;
            if (item.categoryMaps[0].category.menuMaps && item.categoryMaps[0].category.menuMaps.length > 0) {
                menuName = item.categoryMaps[0].category.menuMaps[0].menu.name;
            }
        }
        
        // Tính giá cuối cùng (ưu tiên overridePrice ở chi nhánh)
        let finalPrice = item.basePrice;
        if (item.restaurantMaps && item.restaurantMaps.length > 0 && item.restaurantMaps[0].overridePrice != null) {
            finalPrice = item.restaurantMaps[0].overridePrice;
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
            image: item.image,
            images: item.images,
            price: finalPrice,
            is_featured: item.is_featured,
            allergens: item.allergens,
            spice_level: item.spice_level,
            prep_time: item.prep_time,
            variants: item.variants || [],
            menuName: menuName,
            categoryName: categoryName
        };
    });

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 6;

    return {
        data: mappedData,
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.max(1, Math.ceil(total / limit))
    };
};
