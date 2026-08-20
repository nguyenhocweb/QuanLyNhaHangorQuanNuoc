import { prisma } from "../../../../databases/init.mongodb.js";

export const getTagsRepo = async (query) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
        prisma.tags.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tags.count({ where })
    ]);

    return { data, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getTagByIdRepo = async (id) => {
    return prisma.tags.findUnique({ where: { id } });
};

export const getTagByNameRepo = async (name) => {
    return prisma.tags.findUnique({ where: { name } });
};
