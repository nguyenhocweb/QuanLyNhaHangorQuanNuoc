import { prisma } from "../../../../databases/init.mongodb.js";

export const UpdateUserById = async (userId, data, select) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: data,
        select: select
    });
    return user;
}
export const getPasswordByID = async (userId) => {
    const pass = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            password: true,
            providerId: true
        }
    });
    return pass
}
export const countUpgradeRequest = async (where) => {
    const result = await prisma.upgradeRequest.count({
        where
    });
    return result
}
export const getUsersBrandOwner = async (where) => {
    return await prisma.user.findMany({
        where: {
            ...where,
            role: {
                name: "Quản lý thương hiệu"
            },
            // Chỉ lấy những user chưa làm chủ thương hiệu nào (chưa có employment nào có restaurantId = null)
            employments: {
                none: {
                    restaurantId: null
                }
            }
        },
        take: 10,
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true
        }
    })
}

export * from "./upgradeRequest_repo.js";