import { prisma } from "../../../../../databases/init.mongodb.js";

export const getMenuCategoriesRepo = async (brandId, { skip, take, search, is_active, sort_order }) => {
    const where = {
        brandId,
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
        ...(is_active !== undefined ? { is_active } : {}),
        ...(sort_order !== undefined ? { sort_order } : {})
    };

    const [data, total] = await Promise.all([
        prisma.menuCategory.findMany({
            where,
            skip,
            take,
            include: { menuMaps: { include: { menu: { select: { name: true } } } } },
            orderBy: { sort_order: "asc" }
        }),
        prisma.menuCategory.count({ where })
    ]);

    return { data, total };
};
