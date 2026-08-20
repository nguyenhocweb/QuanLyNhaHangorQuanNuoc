import { prisma } from "../../../../databases/init.mongodb.js";
import { calculateWeightedScore } from "../../../../core/utils/calculateWeightedScore.js";

export const getReviewByIdRepo = async (reviewId) => {
    return await prisma.review_Restaurant.findUnique({
        where: { id: reviewId }
    });
};

export const updateReviewRepo = async (reviewId, updateData) => {
    return await prisma.review_Restaurant.update({
        where: { id: reviewId },
        data: updateData
    });
};

export const recalculateRestaurantRatingRepo = async (restaurantId) => {
    const stats = await prisma.review_Restaurant.aggregate({
        where: {
            restaurantId: restaurantId,
            status: "APPROVED"
        },
        _avg: {
            overall_rating: true,
            food_rating: true,
            service_rating: true,
            ambiance_rating: true
        },
        _count: {
            id: true
        }
    });

    const totalRating = stats._count.id || 0;
    const averageRating = stats._avg.overall_rating ? Number(stats._avg.overall_rating.toFixed(1)) : 0;
    const weightedScore = calculateWeightedScore(totalRating, averageRating);

    await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
            totalRating: totalRating,
            averageRating: averageRating,
            averageFoodRating: stats._avg.food_rating ? Number(stats._avg.food_rating.toFixed(1)) : 0,
            averageServiceRating: stats._avg.service_rating ? Number(stats._avg.service_rating.toFixed(1)) : 0,
            averageAmbianceRating: stats._avg.ambiance_rating ? Number(stats._avg.ambiance_rating.toFixed(1)) : 0,
            weightedScore: weightedScore
        }
    });
};
