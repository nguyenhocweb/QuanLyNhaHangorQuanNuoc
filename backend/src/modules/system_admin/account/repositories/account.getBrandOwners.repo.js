import { prisma } from "../../../../databases/init.mongodb.js";

export const getBrandOwnersRepo = async (where) => {
    return await prisma.user.findMany({
        where: {
            ...where,
            systemRole: {
                name: "Khách hàng"
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
    });
};
