import { getPublicRestaurantMenuRepo } from "../repositories/restaurant_menu.get.repo.js";

export const getPublicRestaurantMenuService = async (id) => {
    const menus = await getPublicRestaurantMenuRepo(id);

    // Chuẩn hóa metadata để tương thích với tất cả components (cả menucategory và categories)
    const formattedMenus = menus.map(menu => {
        const cats = (menu.categories || menu.menucategory || []).map(cat => ({
            ...cat,
            items: (cat.items || []).map(item => ({
                ...item,
                price: item.price !== undefined ? item.price : (item.basePrice ?? item.base_price ?? 0)
            }))
        }));

        return {
            ...menu,
            categories: cats,
            menucategory: cats
        };
    });

    return {
        message: "Lấy thực đơn thành công",
        metadata: formattedMenus,
    };
};
