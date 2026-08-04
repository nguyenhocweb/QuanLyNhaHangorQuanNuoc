import { prisma } from "../../../../databases/init.mongodb.js";

export const getAreasAndTablesWithStatus = async (restaurantId) => {
    return await prisma.restaurant_Areas.findMany({
        where: {
            restaurantId: restaurantId,
            is_active: "ACTIVE"
        },
        include: {
            tabels: {
                where: {
                    status: {
                        not: "INACTIVE"
                    }
                },
                // Để MVP, hiện tại chỉ lấy thông tin bàn cơ bản
                // Sau này sẽ join thêm bảng Orders để tính Operational Status thực tế
            }
        },
        orderBy: {
            floor_number: 'asc'
        }
    });
};
