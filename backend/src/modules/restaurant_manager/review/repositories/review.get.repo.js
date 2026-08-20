import { prisma } from "../../../../databases/init.mongodb.js";

const getReviews = async (restaurantId, filter) => {
    return prisma.review_Restaurant.findMany({
        where: { restaurantId, ...filter },
        include: {
            user: {
                select: { id: true, name: true, avatar: true }
            },
            reservation: {
                select: { id: true, confirmation_code: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getReviewStats = async (restaurantId) => {
    const reviews = await prisma.review_Restaurant.findMany({
        where: { restaurantId, status: "APPROVED" },
        select: {
            overall_rating: true,
            food_rating: true,
            service_rating: true,
            ambiance_rating: true,
        }
    });

    const total = reviews.length;
    if (total === 0) return { total: 0, overall: 0, food: 0, service: 0, ambiance: 0, distribution: {} };

    const sum = reviews.reduce((acc, curr) => {
        acc.overall += curr.overall_rating;
        acc.food += curr.food_rating || curr.overall_rating;
        acc.service += curr.service_rating || curr.overall_rating;
        acc.ambiance += curr.ambiance_rating || curr.overall_rating;
        acc.distribution[curr.overall_rating] = (acc.distribution[curr.overall_rating] || 0) + 1;
        return acc;
    }, { overall: 0, food: 0, service: 0, ambiance: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });

    return {
        total,
        overall: (sum.overall / total).toFixed(1),
        food: (sum.food / total).toFixed(1),
        service: (sum.service / total).toFixed(1),
        ambiance: (sum.ambiance / total).toFixed(1),
        distribution: sum.distribution
    };
};

export default { getReviews, getReviewStats };