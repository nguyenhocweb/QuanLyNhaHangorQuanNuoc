import e from "express";
import { prisma } from "../../../../databases/init.mongodb.js";
const homeSelect={
    is_featured: true,
            description: true,
            id: true,
            name: true,
            base_price: true,
            image: true,
            restaurant: {
                select: {
                    name: true
                }
            },
            brand: {
                select: { name: true }
            }
};
const brandSelect={
    description: true,
    id: true,
    name: true,
    base_price: true,
    image: true,
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
    
    if(type !== "home") return result??null; // nếu không phải trang home thì trả về kết quả ngay mà không cần map thêm tên nhà hàng và thương hiệu

    return result ? result.map(({ restaurant, brand, ...e }) => ({
        ...e,
        restaurantName: restaurant?.name ?? undefined,
        brandName: brand?.name ?? undefined
    })) : null
}
export const countDishs = async (where) => {
    return prisma.menuItem.count({
        where: where
    });
}