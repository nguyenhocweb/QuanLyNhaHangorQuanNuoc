import { prisma } from "../../../../databases/init.mongodb.js";

export const getReviewById = async (reviewId) => {
    return await prisma.review_Restaurant.findUnique({
        where: { id: reviewId }
    });
};

export const updateReviewStatusRepo = async (reviewId, status) => {
    return await prisma.review_Restaurant.update({
        where: { id: reviewId },
        data: { status }
    });
};
