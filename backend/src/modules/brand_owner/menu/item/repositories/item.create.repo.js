import { prisma } from "../../../../../databases/init.mongodb.js";

export const createItemRepo = async (brandId, categoryIds, payload) => {
    const { name, description, basePrice, isActive, variants, modifierGroups, restaurantIds, sku: customSku, is_featured, prep_time, spice_level, allergens, sort_order, image } = payload;
    
    // Generate SKU automatically if not provided
    const sku = customSku && customSku.trim() !== "" ? customSku : `SKU-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    return prisma.menuItem.create({
        data: {
            name,
            description,
            basePrice,
            image,
            sku,
            is_featured,
            prep_time,
            spice_level,
            allergens,
            sort_order,
            isActive,
            brand: { connect: { id: brandId } },
            categoryMaps: {
                create: categoryIds.map(categoryId => ({ categoryId }))
            },
            
            // Nested Create for Variants
            variants: variants.length > 0 ? {
                create: variants.map((v, idx) => ({
                    name: v.name,
                    price: v.price,
                    sku: `${sku}-V${idx}`
                }))
            } : undefined,

            // Nested Create for Modifier Groups & Options
            modifierGroups: modifierGroups.length > 0 ? {
                create: modifierGroups.map(group => ({
                    name: group.name,
                    minSelections: group.minSelections,
                    maxSelections: group.maxSelections,
                    options: {
                        create: group.options.map(opt => ({
                            name: opt.name,
                            priceExtra: opt.priceExtra
                        }))
                    }
                }))
            } : undefined,

            // Nested Create for Distribution (Restaurant Maps)
            restaurantMaps: restaurantIds.length > 0 ? {
                create: restaurantIds.map(rId => ({
                    restaurantId: rId,
                    isAvailable: isActive
                }))
            } : undefined
        },
        include: {
            variants: true,
            modifierGroups: {
                include: { options: true }
            },
            restaurantMaps: true,
            categoryMaps: { include: { category: true } }
        }
    });
};
