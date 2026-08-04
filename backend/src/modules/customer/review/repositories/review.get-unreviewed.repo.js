import { prisma } from "../../../../databases/init.mongodb.js";

export const getUnreviewedMealsRepo = async (userId, { page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    // 1. Lấy tất cả đặt bàn đã hoàn thành của khách hàng (không join trực tiếp restaurant để tránh lỗi orphaned data)
    const completedReservations = await prisma.reservations.findMany({
        where: {
            userId: userId,
            status: "COMPLETED"
        },
        orderBy: {
            reservation_date: 'desc'
        },
        select: {
            id: true,
            confirmation_code: true,
            reservation_date: true,
            start_time: true,
            party_size: true,
            restaurantId: true,
            review_restaurant: {
                select: {
                    id: true
                }
            }
        }
    });

    // 2. Lọc bỏ những đơn đã có đánh giá
    const unreviewedMeals = completedReservations.filter(r => !r.review_restaurant);
    const total = unreviewedMeals.length;

    // 3. Phân trang
    const paginatedMeals = unreviewedMeals.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

    // 4. Lấy danh sách ID nhà hàng tương ứng và truy vấn riêng bảng Restaurant
    const restaurantIds = [...new Set(paginatedMeals.map(m => m.restaurantId).filter(Boolean))];
    const restaurants = await prisma.restaurant.findMany({
        where: {
            id: { in: restaurantIds }
        },
        select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            imageMain: true
        }
    });

    const restaurantMap = new Map(restaurants.map(r => [r.id, r]));

    // 5. Ghép dữ liệu nhà hàng vào từng bữa ăn
    const mealsWithRestaurant = paginatedMeals.map(m => ({
        ...m,
        restaurant: restaurantMap.get(m.restaurantId) || {
            id: m.restaurantId || "unknown",
            name: "Nhà hàng Foleat",
            logo: "",
            address: { street: "Hệ thống Foleat" }
        }
    }));

    return {
        meals: mealsWithRestaurant,
        total
    };
};
