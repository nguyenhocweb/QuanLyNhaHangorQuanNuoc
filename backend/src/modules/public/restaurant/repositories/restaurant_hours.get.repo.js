import { prisma } from "../../../../databases/init.mongodb.js";

export const getPublicRestaurantHoursRepo = async (restaurantId) => {
    return prisma.restaurant.findFirst({
        where: {
            id: restaurantId,
            statusByAdmin: "ACTIVE",
            statusByBrand: "ACTIVE",
        },
        select: {
            id: true,
            operatingHours: {
                orderBy: {
                    day_of_week: 'asc'
                }
            },
            specialSchedules: {
                where: {
                    date: {
                        gte: new Date(), // Chỉ lấy các lịch đặc biệt trong tương lai
                    }
                },
                orderBy: {
                    date: 'asc'
                },
                take: 30 // Lấy tối đa 30 ngày tới
            }
        }
    });
};
