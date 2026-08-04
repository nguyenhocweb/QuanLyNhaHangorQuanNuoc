import { prisma } from "../../../../databases/init.mongodb.js";

export const getReservationsRepo = async (restaurantId, filters) => {
    const { date, status, search, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where = {
        restaurantId
    };

    if (date) {
        // Lấy từ 00:00:00 đến 23:59:59 của ngày date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        where.reservation_date = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    if (status && status !== "ALL") {
        where.status = status;
    }

    if (search) {
        where.OR = [
            { guest_name: { contains: search, mode: "insensitive" } },
            { guest_phone: { contains: search } }
        ];
    }

    const [data, total] = await Promise.all([
        prisma.reservations.findMany({
            where,
            include: {
                reservation_tables: {
                    include: { 
                        table: {
                            include: { area: true }
                        }
                    }
                }
            },
            orderBy: [
                { createdAt: 'desc' }
            ],
            skip,
            take: Number(limit)
        }),
        prisma.reservations.count({ where })
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
};

export const getReservationByIdRepo = async (id, restaurantId) => {
    return prisma.reservations.findFirst({
        where: { id, restaurantId },
        include: { 
            reservation_tables: { 
                include: { 
                    table: {
                        include: { area: true }
                    }
                } 
            } 
        }
    });
};
