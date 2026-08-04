import { getPublicRestaurantMenuRepo } from "../repositories/restaurant_menu.get.repo.js";

export const getPublicRestaurantMenuService = async (id) => {
    const menus = await getPublicRestaurantMenuRepo(id);

    // Format dữ liệu để trả về giá chính xác (overridePrice nếu có, ngược lại basePrice)
    const formattedMenus = menus.map(menu => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        // Bóc tách M:N từ categoryMaps -> category
        menucategory: (menu.categoryMaps || []).map(catMap => {
            const category = catMap.category;
            if (!category) return null;
            
            return {
                id: category.id,
                name: category.name,
                description: category.description,
                // Bóc tách M:N từ itemMaps -> menuItem
                items: (category.itemMaps || [])
                    .map(itemMap => itemMap.menuItem)
                    .filter(Boolean) // Loại bỏ null nếu có
                    // Chỉ hiển thị các món đang CÓ HÀNG và ĐƯỢC PHÂN BỔ tại nhà hàng này
                    .filter(item => item.restaurantMaps && item.restaurantMaps.length > 0 && item.restaurantMaps[0].isAvailable)
                    .map(item => {
                        const mapData = item.restaurantMaps[0];
                        return {
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            image: item.image,
                            images: item.images,
                            is_featured: item.is_featured,
                            allergens: item.allergens,
                            spice_level: item.spice_level,
                            prep_time: item.prep_time,
                            variants: item.variants || [],
                            // Nếu có giá ghi đè tại nhà hàng thì dùng giá ghi đè, nếu không thì dùng giá gốc
                            price: mapData.overridePrice !== null ? mapData.overridePrice : item.basePrice
                        };
                    })
            };
        }).filter(Boolean) // Loại bỏ category null
    }));

    return {
        message: "Lấy thực đơn thành công",
        metadata: formattedMenus,
    };
};
