export const textBuildMenuItem = (menuItem) => {
    const rawText = [
        `Món ăn: ${menuItem.name || "Món ăn ẩn danh"} là 1 món ăn.`,
        ` ${menuItem.restaurantName ? `món ăn này thuộc nhà hàng: ${menuItem.restaurantName}` : ""}. `,
        `${menuItem.brandName ? `món ăn này thuộc thương hiệu: ${menuItem.brandName}` : ""}.`,

        ` Giá cơ bản: ${menuItem.base_price || 0}.`,
        ` Phần trăm giảm giá: ${menuItem.discount_percent ?? 0}%`,
        ` hạn ngày hết giảm giá: ${menuItem.discount_until ?? "Không có thông tin"}`,
        menuItem.is_featured ? "là món hot" : "",
        ` Menu: ${menuItem.menuName || "chưa cập nhật danh mục"}.`,
        ` Danh mục: ${menuItem.categoryName || "chưa cập nhật danh mục"}.`,

        ` Mô tả: ${menuItem.description || "chưa cập nhật mô tả"}.`,
        ` thành phần món ăn gồm: ${menuItem.allergens ? menuItem.allergens.join(", ") : "Không có thông tin"}. `,

    ].join(" ");
    return rawText
}
export const buildMenuItemVector = (menuItem) => {
    const rawText = [
        `Món ăn: ${menuItem.name || "Món ăn ẩn danh"} là 1 món ăn.\n`,
        ` ${menuItem.restaurantName ? `món ăn này thuộc nhà hàng: ${menuItem.restaurantName} \n` : ""}. `,
        `${menuItem.brandName ? `món ăn này thuộc thương hiệu: ${menuItem.brandName}` : ""}.\n`,

        ` Giá cơ bản: ${menuItem.base_price || 0}.\n`,
        ` Phần trăm giảm giá: ${menuItem.discount_percent ?? 0}%\n`,
        ` hạn ngày hết giảm giá: ${menuItem.discount_until ?? "Không có thông tin"}\n`,
        menuItem.is_featured ? "là món hot \n" : "",
        ` Menu: ${menuItem.menuName || "chưa cập nhật danh mục"}.\n`,
        ` Danh mục: ${menuItem.categoryName || "chưa cập nhật danh mục"}.\n`,

        ` Mô tả: ${menuItem.description || "chưa cập nhật mô tả"}.\n`,
        ` thành phần món ăn gồm: ${menuItem.allergens ? menuItem.allergens.join(", ") : "Không có thông tin"}. \n`,

    ].join(" ");
    return {
        id: menuItem.id,
        values: menuItem.embedding,
        metadata: {
            name: menuItem.name || "món ăn ẩn danh",
            description: menuItem.description || "chưa cập nhật mô tả",
            base_price: menuItem.base_price || 0,
            restaurantName: menuItem.restaurantName || "chưa cập nhật nhà hàng",
            categoryName: menuItem.categoryName || "chưa cập nhật danh mục",
            text: rawText
        }
    };
};