import { prisma } from "../../../../databases/init.mongodb.js";

export const createUpgradeRequest = async (data) => {
    return await prisma.upgradeRequest.create({
        data
    });
};

export const updateUpgradeRequest = async (userId, data) => {
    return await prisma.upgradeRequest.update({
        where: { userId },
        data
    });
};

export const findUpgradeRequestByUserId = async (userId) => {
    return await prisma.upgradeRequest.findUnique({
        where: { userId }
    });
};
