import { prisma } from "../../../../databases/init.mongodb.js";
import { recalculateRestaurantRatingRepo } from "./review.update.repo.js";

export const deleteReviewRepo = async (reviewId) => {
    const deleted = await prisma.review_Restaurant.delete({
        where: { id: reviewId }
    });

    if (deleted && deleted.restaurantId) {
        await recalculateRestaurantRatingRepo(deleted.restaurantId);
    }

    return deleted;
};
