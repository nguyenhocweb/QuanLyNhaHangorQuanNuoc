import { generateSeedId } from "./user.data.js";

// Helper function to get random items from an array
const getRandomSubarray = (arr, size) => {
    const shuffled = arr.slice(0);
    let i = arr.length;
    const min = i - size;
    let temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
};

export const generateMenus = (brandData) => {
    return brandData.map((brand, index) => ({
        id: generateSeedId("d1d1d1d1d1d1d1d1d1", index + 1),
        brandId: brand.id,
        name: `Menu Chính - ${brand.name}`,
        description: `Menu tiêu chuẩn áp dụng cho thương hiệu ${brand.name}`,
        is_active: true,
        sort_order: 1
    }));
};

export const generateMenuCategories = (brandData) => {
    const categories = [];
    brandData.forEach((brand, bIndex) => {
        const catNames = ["Khai vị", "Món chính", "Thức uống", "Tráng miệng", "Combo"];
        catNames.forEach((name, cIndex) => {
            const globalIndex = bIndex * catNames.length + cIndex + 1;
            categories.push({
                id: generateSeedId("c1c1c1c1c1c1c1c1c1", globalIndex),
                brandId: brand.id,
                name: name,
                description: `Danh mục ${name} của ${brand.name}`,
                sort_order: cIndex + 1,
                is_active: true
            });
        });
    });
    return categories;
};

export const generateMenuCategoryMaps = (menus, categories) => {
    const maps = [];
    let mapIndex = 1;
    menus.forEach(menu => {
        // Find categories for this menu's brand
        const brandCategories = categories.filter(c => c.brandId === menu.brandId);
        brandCategories.forEach(cat => {
            maps.push({
                id: generateSeedId("d2d2d2d2d2d2d2d2d2", mapIndex++),
                menuId: menu.id,
                categoryId: cat.id,
                sort_order: cat.sort_order
            });
        });
    });
    return maps;
};

export const generateMenuItems = (brandData) => {
    const items = [];
    let globalIndex = 1;
    brandData.forEach(brand => {
        for (let i = 1; i <= 60; i++) {
            let itemType = "FOOD";
            if (i > 40 && i <= 50) itemType = "DRINK";
            if (i > 50) itemType = "DESSERT";

            items.push({
                id: generateSeedId("d3d3d3d3d3d3d3d3d3", globalIndex),
                brandId: brand.id,
                sku: `SKU-B${brand.id.slice(-4)}-${i.toString().padStart(3, '0')}`,
                name: `Món ${i} - ${brand.name}`,
                description: `Mô tả chi tiết cho Món ${i} của thương hiệu ${brand.name}`,
                image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],
                basePrice: 50000 + (Math.floor(Math.random() * 10) * 10000), // 50k - 140k
                item_type: itemType,
                allergens: i % 5 === 0 ? ["Đậu phộng", "Hải sản"] : [],
                spice_level: i % 3 === 0 ? 2 : 0,
                prep_time: 15,
                isActive: true,
                is_featured: i <= 5, // 5 món đầu là signature
                sort_order: i
            });
            globalIndex++;
        }
    });
    return items;
};

export const generateItemCategoryMaps = (items, categories) => {
    const maps = [];
    let mapIndex = 1;
    items.forEach(item => {
        const brandCategories = categories.filter(c => c.brandId === item.brandId);
        // Randomly assign to one of the brand's categories
        const cat = brandCategories[item.sort_order % brandCategories.length];
        maps.push({
            id: generateSeedId("d4d4d4d4d4d4d4d4d4", mapIndex++),
            categoryId: cat.id,
            menuItemId: item.id,
            sort_order: 1
        });
    });
    return maps;
};

export const generateItemVariants = (items) => {
    const variants = [];
    let vIndex = 1;
    items.forEach(item => {
        // All items have 3 sizes
        const sizes = [
            { name: "Size S", priceOffset: 0 },
            { name: "Size M", priceOffset: 15000 },
            { name: "Size L", priceOffset: 30000 }
        ];
        sizes.forEach((s, idx) => {
            variants.push({
                id: generateSeedId("d5d5d5d5d5d5d5d5d5", vIndex++),
                menuItemId: item.id,
                name: s.name,
                sku: `${item.sku}-${s.name.charAt(s.name.length-1)}`,
                price: item.basePrice + s.priceOffset
            });
        });
    });
    return variants;
};

export const generateModifierGroups = (items) => {
    const groups = [];
    let gIndex = 1;
    items.forEach(item => {
        groups.push({
            id: generateSeedId("d6d6d6d6d6d6d6d6d6", gIndex++),
            menuItemId: item.id,
            name: "Chọn Độ Ngọt",
            minSelections: 1,
            maxSelections: 1
        });
        groups.push({
            id: generateSeedId("d6d6d6d6d6d6d6d6d6", gIndex++),
            menuItemId: item.id,
            name: "Thêm Topping",
            minSelections: 0,
            maxSelections: 5
        });
    });
    return groups;
};

export const generateModifierOptions = (modifierGroups) => {
    const options = [];
    let oIndex = 1;
    modifierGroups.forEach(group => {
        if (group.name === "Chọn Độ Ngọt") {
            const opts = ["100% Đường", "70% Đường", "30% Đường"];
            opts.forEach(opt => {
                options.push({
                    id: generateSeedId("d7d7d7d7d7d7d7d7d7", oIndex++),
                    modifierGroupId: group.id,
                    name: opt,
                    priceExtra: 0
                });
            });
        } else {
            const opts = [
                { name: "Trân châu đen", price: 10000 },
                { name: "Thạch trái cây", price: 15000 },
                { name: "Phô mai", price: 20000 }
            ];
            opts.forEach(opt => {
                options.push({
                    id: generateSeedId("d7d7d7d7d7d7d7d7d7", oIndex++),
                    modifierGroupId: group.id,
                    name: opt.name,
                    priceExtra: opt.price
                });
            });
        }
    });
    return options;
};

export const generateRestaurantMenuItems = (restaurantData, items) => {
    const rm = [];
    let rmIndex = 1;
    restaurantData.forEach(restaurant => {
        const brandItems = items.filter(i => i.brandId === restaurant.brandId);
        // Lấy đúng 40 món (cố định để dễ test, lấy 40 món đầu tiên của brand đó)
        const selectedItems = brandItems.slice(0, 40);
        selectedItems.forEach(item => {
            rm.push({
                id: generateSeedId("d8d8d8d8d8d8d8d8d8", rmIndex++),
                restaurantId: restaurant.id,
                menuItemId: item.id,
                isAvailable: true,
                overridePrice: null
            });
        });
    });
    return rm;
};
