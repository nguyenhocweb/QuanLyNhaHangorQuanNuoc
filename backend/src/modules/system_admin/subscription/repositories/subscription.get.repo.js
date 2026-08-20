import { prisma } from "../../../../databases/init.mongodb.js";

export const findSubscriptions = async (where, skip, limit) => {
    return await prisma.subscriptionPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
    });
};

export const countSubscriptions = async (where) => {
    return await prisma.subscriptionPlan.count({ where });
};

export const findSubscriptionByName = async (name) => {
    return await prisma.subscriptionPlan.findUnique({
        where: { name }
    });
};

export const findSubscriptionById = async (id) => {
    return await prisma.subscriptionPlan.findUnique({
        where: { id }
    });
};
