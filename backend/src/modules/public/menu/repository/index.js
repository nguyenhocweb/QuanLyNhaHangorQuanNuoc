import e from "express";
import { prisma } from "../../../../databases/init.mongodb.js";
const homeSelect={
    is_featured: true,
            description: true,
            id: true,
            name: true,
            base_price: true,
            image: true,
            restaurantMenuItems: {
                include: {
                    restaurant: {
                        select: { name: true }
                    }
                }
            },
            brand: {
                select: { name: true }
            },
            itemVariants: {
                select: { name: true, price: true }
            }
};
const brandSelect={
    description: true,
    id: true,
    name: true,
    base_price: true,
    image: true,
    itemVariants: {
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
    
    if(type !== "home") return result ? result.map(({ itemVariants, ...e }) => ({ 
        ...e, 
        variants: itemVariants?.length ? itemVariants : undefined
    })) : null;

    return result ? result.map(({ restaurantMenuItems, brand, itemVariants, ...e }) => ({
        ...e,
        restaurantName: restaurantMenuItems?.[0]?.restaurant?.name ?? undefined,
        brandName: brand?.name ?? undefined,
        variants: itemVariants?.length ? itemVariants : undefined
    })) : null
}
export const countDishs = async (where) => {
    return prisma.menuItem.count({
        where: where
    });
}