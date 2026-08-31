import { prisma } from "../../../../databases/init.mongodb.js";

export const getReservationsRepo = async (restaurantId, filters) => {
    const { tab, date, status, search, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const where = {
        restaurantId
    };

    let orderBy = [{ createdAt: 'desc' }];

    // 1. Phân loại theo Tab nghiệp vụ
    if (tab === "PENDING") {
        // Gom TẤT CẢ các đơn đang chờ duyệt (bất kể đặt cho ngày nào)
        where.status = "PENDING";
        orderBy = [{ reservation_date: 'asc' }, { start_time: 'asc' }];
    } else if (tab === "TODAY") {
        // Lịch trong ngày hôm nay
        where.reservation_date = {
            gte: startOfToday,
            lte: endOfToday
        };
        orderBy = [{ start_time: 'asc' }];
        if (status && status !== "ALL") {
            where.status = status;
        }
    } else if (tab === "UPCOMING") {
        // Đặt trước từ ngày mai trở đi
        where.reservation_date = {
            gt: endOfToday
        };
        where.status = { in: ["PENDING", "CONFIRMED"] };
        orderBy = [{ reservation_date: 'asc' }, { start_time: 'asc' }];
    } else {
        // Tab ALL hoặc bộ lọc tự do
        if (date) {
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
    }

    if (search && search.trim()) {
        where.OR = [
            { guest_name: { contains: search.trim(), mode: "insensitive" } },
            { guest_phone: { contains: search.trim() } },
            { confirmation_code: { contains: search.trim(), mode: "insensitive" } }
        ];
    }

    // 2. Truy vấn dữ liệu & Thống kê song song
    const [data, total, pendingCount, todayCount, seatedCount, upcomingCount] = await Promise.all([
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
            orderBy,
            skip,
            take: Number(limit)
        }),
        prisma.reservations.count({ where }),
        prisma.reservations.count({ where: { restaurantId, status: "PENDING" } }),
        prisma.reservations.count({ where: { restaurantId, reservation_date: { gte: startOfToday, lte: endOfToday } } }),
        prisma.reservations.count({ where: { restaurantId, status: "SEATED" } }),
        prisma.reservations.count({ where: { restaurantId, reservation_date: { gt: endOfToday }, status: { in: ["PENDING", "CONFIRMED"] } } })
    ]);

    const stats = {
        pending: pendingCount,
        today: todayCount,
        seated: seatedCount,
        upcoming: upcomingCount
    };

    return { 
        data, 
        stats,
        total, 
        page: Number(page), 
        limit: Number(limit) 
    };
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
