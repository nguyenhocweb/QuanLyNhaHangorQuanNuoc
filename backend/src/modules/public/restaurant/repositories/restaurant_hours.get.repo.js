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
            operating_hours: {
                orderBy: {
                    day_of_week: 'asc'
                }
            },
            special_schedules: {
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
