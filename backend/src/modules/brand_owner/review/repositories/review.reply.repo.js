import { prisma } from "../../../../databases/init.mongodb.js";

export const getReviewWithRestaurant = async (reviewId) => {
    return await prisma.review_Restaurant.findUnique({
        where: { id: reviewId },
        include: {
            restaurant: {
                select: { brandId: true }
            }
        }
    });
};

export const updateReviewReplyRepo = async (reviewId, staffResponse) => {
    return await prisma.review_Restaurant.update({
        where: { id: reviewId },
        data: { staff_response: staffResponse }
    });
};
