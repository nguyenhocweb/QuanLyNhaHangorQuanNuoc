import e from "express";
import { prisma } from "../../../../databases/init.mongodb.js";
const homeSelect={
    is_featured: true,
            description: true,
            id: true,
            name: true,
            basePrice: true,
            image: true,
            restaurantMaps: {
                include: {
                    restaurant: {
                        select: { name: true }
                    }
                }
            },
            brand: {
                select: { name: true }
            },
            variants: {
                select: { name: true, price: true }
            }
};
const brandSelect={
    description: true,
    id: true,
    name: true,
    basePrice: true,
    image: true,
    variants: {
        select: { name: true, price: true }
    }
}

export const getDishs = async ({page, limit, where, type}) => {
   
    const result = await prisma.menuItem.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: where,
        orderBy: [
            { is_featured: "desc" }, // món hot
            { createdAt: "desc" },// mới nhất
        ],
        select: type === "home" ? homeSelect : brandSelect
    });
    
    if(type !== "home") return result ? result.map(({ basePrice, variants, ...e }) => ({ 
        ...e, 
        base_price: basePrice,
        variants: variants?.length ? variants : undefined
    })) : null;

    return result ? result.map(({ restaurantMaps, brand, basePrice, variants, ...e }) => ({
        ...e,
        base_price: basePrice,
        restaurantName: restaurantMaps?.[0]?.restaurant?.name ?? undefined,
        brandName: brand?.name ?? undefined,
        variants: variants?.length ? variants : undefined
    })) : null
}
export const countDishs = async (where) => {
    return prisma.menuItem.count({
        where: where
    });
}