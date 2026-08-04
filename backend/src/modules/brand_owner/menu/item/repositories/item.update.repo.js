import { prisma } from "../../../../../databases/init.mongodb.js";

export const updateItemRepo = async (id, categoryIds, payload) => {
    const { name, description, basePrice, isActive, variants, modifierGroups, restaurantIds, sku, is_featured, prep_time, spice_level, allergens, sort_order, image } = payload;
    
    const updateData = {
        name, description, basePrice, isActive, image,
        sku, is_featured, prep_time, spice_level, allergens, sort_order
    };

    if (categoryIds !== undefined) {
        updateData.categoryMaps = {
            deleteMany: {},
            create: categoryIds.map(categoryId => ({ categoryId }))
        };
    }

    const item = await prisma.menuItem.update({
        where: { id },
        data: updateData
    });

    if (variants !== undefined) {
        await prisma.itemVariant.deleteMany({ where: { menuItemId: id } });
        if (variants.length > 0) {
            await prisma.itemVariant.createMany({
                data: variants.map((v, idx) => ({
                    menuItemId: id,
                    name: v.name,
                    price: v.price,
                    sku: `${item.sku}-V${idx}-${Date.now().toString().slice(-4)}`
                }))
            });
        }
    }

    if (modifierGroups !== undefined) {
        await prisma.modifierGroup.deleteMany({ where: { menuItemId: id } });
        for (const group of modifierGroups) {
            await prisma.modifierGroup.create({
                data: {
                    menuItemId: id,
                    name: group.name,
                    minSelections: group.minSelections,
                    maxSelections: group.maxSelections,
                    options: {
                        create: group.options.map(opt => ({
                            name: opt.name,
                            priceExtra: opt.priceExtra
                        }))
                    }
                }
            });
        }
    }

    if (restaurantIds !== undefined) {
        await prisma.restaurantMenuItem.deleteMany({ where: { menuItemId: id } });
        if (restaurantIds.length > 0) {
            await prisma.restaurantMenuItem.createMany({
                data: restaurantIds.map(rId => ({
                    restaurantId: rId,
                    menuItemId: id,
                    isAvailable: isActive !== undefined ? isActive : item.isActive
                }))
            });
        }
    }

    return item;
};
