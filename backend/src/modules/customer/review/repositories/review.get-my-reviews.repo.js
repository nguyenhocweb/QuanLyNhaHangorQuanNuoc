import { prisma } from "../../../../databases/init.mongodb.js";

export const getMyReviewsRepo = async (userId, { page = 1, limit = 10, status, rating }) => {
    const skip = (page - 1) * limit;

    const where = {
        userId: userId
    };

    if (status && status !== "ALL") {
        where.status = status;
    }

    if (rating && parseInt(rating) > 0) {
        where.overall_rating = parseInt(rating);
    }

    // 1. Lấy danh sách đánh giá của khách hàng mà không join trực tiếp để tránh lỗi orphaned data
    const [reviews, total] = await Promise.all([
        prisma.review_Restaurant.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.review_Restaurant.count({ where })
    ]);

    // 2. Lấy danh sách ID nhà hàng và đặt bàn
    const restaurantIds = [...new Set(reviews.map(r => r.restaurantId).filter(Boolean))];
    const reservationIds = [...new Set(reviews.map(r => r.reservationId).filter(Boolean))];

    // 3. Truy vấn riêng biệt bảng Restaurant và Reservations
    const [restaurants, reservations] = await Promise.all([
        prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: {
                id: true,
                name: true,
                logo: true,
                address: true,
                imageMain: true
            }
        }),
        prisma.reservations.findMany({
            where: { id: { in: reservationIds } },
            select: {
                id: true,
                reservation_date: true,
                start_time: true,
                party_size: true,
                confirmation_code: true
            }
        })
    ]);

    const restaurantMap = new Map(restaurants.map(r => [r.id, r]));
    const reservationMap = new Map(reservations.map(r => [r.id, r]));

    // 4. Ghép dữ liệu vào từng bài đánh giá
    const reviewsWithRelations = reviews.map(r => ({
        ...r,
        restaurant: restaurantMap.get(r.restaurantId) || {
            id: r.restaurantId || "unknown",
            name: "Nhà hàng Foleat",
            logo: "",
            address: { street: "Hệ thống Foleat" }
        },
        reservation: reservationMap.get(r.reservationId) || null
    }));

    return {
        reviews: reviewsWithRelations,
        total
    };
};

export const getMyReviewsStatsRepo = async (userId) => {
    const [stats, totalReviews, completedReservations] = await Promise.all([
        prisma.review_Restaurant.aggregate({
            where: { userId },
            _avg: { overall_rating: true }
        }),
        prisma.review_Restaurant.count({
            where: { userId }
        }),
        prisma.reservations.findMany({
            where: {
                userId,
                status: "COMPLETED"
            },
            select: {
                id: true,
                review_restaurant: {
                    select: { id: true }
                }
            }
        })
    ]);

    const unreviewedCount = completedReservations.filter(r => !r.review_restaurant).length;

    return {
        totalReviews,
        averageRating: stats._avg.overall_rating ? Number(stats._avg.overall_rating.toFixed(1)) : 0,
        helpfulCount: 0,
        unreviewedCount
    };
};
