import { prisma } from "../../../../../databases/init.mongodb.js";

export const getMenusRepo = async (brandId, { skip, take, search, is_active, sort_order }) => {
    const where = {
        brandId,
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(is_active !== undefined ? { is_active } : {}),
        ...(sort_order !== undefined ? { sort_order } : {})
    };

    const [data, total] = await Promise.all([
        prisma.menu.findMany({
            where,
            skip,
            take,
            orderBy: { sort_order: "asc" }
        }),
        prisma.menu.count({ where })
    ]);

    return { data, total };
};
