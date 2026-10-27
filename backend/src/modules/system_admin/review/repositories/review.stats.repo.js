import { prisma } from "../../../../databases/init.mongodb.js";

export const getSystemReviewStatsRepo = async () => {
    const [totalReviews, publicReviews, hiddenReviews, repliedReviews, avgAggregate] = await Promise.all([
        prisma.review_Restaurant.count(),
        prisma.review_Restaurant.count({ where: { is_public: true } }),
        prisma.review_Restaurant.count({ where: { is_public: false } }),
        prisma.review_Restaurant.count({ where: { staff_response: { not: null } } }),
        prisma.review_Restaurant.aggregate({
            _avg: {
                overall_rating: true,
                food_rating: true,
                service_rating: true,
                ambiance_rating: true
            }
        })
    ]);

    return {
        totalReviews,
        publicReviews,
        hiddenReviews,
        repliedReviews,
        avgRatings: {
            overall: Number((avgAggregate._avg.overall_rating || 0).toFixed(1)),
            food: Number((avgAggregate._avg.food_rating || 0).toFixed(1)),
            service: Number((avgAggregate._avg.service_rating || 0).toFixed(1)),
            ambiance: Number((avgAggregate._avg.ambiance_rating || 0).toFixed(1))
        }
    };
};
