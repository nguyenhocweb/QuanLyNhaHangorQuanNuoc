import { prisma } from "../../../../databases/init.mongodb.js";

export const getAmenitysRepo = async (query) => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
        prisma.restaurant_Amenities.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.restaurant_Amenities.count({ where })
    ]);

    return { data, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getAmenityByIdRepo = async (id) => {
    return prisma.restaurant_Amenities.findUnique({ where: { id } });
};

export const getAmenityByNameRepo = async (name) => {
    return prisma.restaurant_Amenities.findUnique({ where: { name } });
};
