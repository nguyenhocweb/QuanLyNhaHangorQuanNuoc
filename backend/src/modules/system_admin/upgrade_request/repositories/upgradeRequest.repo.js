import { prisma } from "../../../../databases/init.mongodb.js";

export const getUpgradeRequests = async (query) => {
    const { page = 1, limit = 10, search = "", status } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
        where.brandName = { contains: search, mode: 'insensitive' };
    }
    if (status) {
        where.status = status;
    }

    const [data, total] = await Promise.all([
        prisma.upgradeRequest.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        sdt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.upgradeRequest.count({ where })
    ]);

    return {
        data,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
    };
};

export const findUpgradeRequestById = async (id) => {
    return prisma.upgradeRequest.findUnique({
        where: { id }
    });
};

export const updateUpgradeRequestStatus = async (id, status) => {
    return prisma.upgradeRequest.update({
        where: { id },
        data: { status }
    });
};
