import { prisma } from "../../../../databases/init.mongodb.js";

export const getFeaturedReviewsRepo = async (limit = 9) => {
    // 1. Lấy danh sách đánh giá có điểm cao từ 4 sao trở lên và đang hoạt động
    const reviews = await prisma.review_Restaurant.findMany({
        where: {
            status: "ACTIVE",
            overall_rating: { gte: 4 }
        },
        take: parseInt(limit),
        orderBy: {
            createdAt: "desc"
        }
    });

    if (!reviews || reviews.length === 0) {
        return [];
    }

    // 2. Thu thập danh sách ID người dùng và ID nhà hàng
    const userIds = [...new Set(reviews.map(r => r.userId).filter(Boolean))];
    const restaurantIds = [...new Set(reviews.map(r => r.restaurantId).filter(Boolean))];

    // 3. Truy vấn riêng biệt bảng User và Restaurant để tránh lỗi orphaned relation trong MongoDB
    const [users, restaurants] = await Promise.all([
        prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                name: true,
                avatar: true,
                email: true
            }
        }),
        prisma.restaurant.findMany({
            where: { id: { in: restaurantIds } },
            select: {
                id: true,
                name: true
            }
        })
    ]);

    const userMap = new Map(users.map(u => [u.id, u]));
    const restaurantMap = new Map(restaurants.map(r => [r.id, r]));

    // 4. Ghép nối dữ liệu trong bộ nhớ
    return reviews.map(rev => {
        const user = userMap.get(rev.userId) || { name: "Thực khách Foleat", avatar: null };
        const restaurant = restaurantMap.get(rev.restaurantId) || { name: "Nhà hàng Foleat" };

        return {
            id: rev.id,
            name: user.name || "Thực khách Foleat",
            role: "Thực khách đã trải nghiệm",
            avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            restaurant: restaurant.name,
            rating: rev.overall_rating || 5,
            comment: rev.comment || "Không gian đẹp, món ăn xuất sắc, phục vụ chu đáo và tận tình.",
            date: new Date(rev.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
        };
    });
};
