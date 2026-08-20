import { prisma } from "../../../../databases/init.mongodb.js";

export const upsertOperatingHoursRepo = async (restaurantId, operatingHours) => {
    // operatingHours là một mảng 7 phần tử
    const transactions = operatingHours.map(hour => {
        return prisma.operating_Hours.upsert({
            where: {
                restaurantId_day_of_week: {
                    restaurantId: restaurantId,
                    day_of_week: hour.day_of_week
                }
            },
            update: {
                is_closed: hour.is_closed,
                open_time: hour.open_time,
                close_time: hour.close_time,
                break_start: hour.break_start,
                break_end: hour.break_end
            },
            create: {
                restaurantId: restaurantId,
                day_of_week: hour.day_of_week,
                is_closed: hour.is_closed,
                open_time: hour.open_time || "",
                close_time: hour.close_time || "",
                break_start: hour.break_start,
                break_end: hour.break_end
            }
        });
    });

    return prisma.$transaction(transactions);
};
