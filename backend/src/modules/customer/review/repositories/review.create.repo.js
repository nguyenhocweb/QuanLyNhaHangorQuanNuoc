import { prisma } from "../../../../databases/init.mongodb.js";

export const getReservationForReview = async (reservationId) => {
    return await prisma.reservations.findUnique({
        where: { id: reservationId },
        select: {
            id: true,
            status: true,
            restaurantId: true,
            userId: true
        }
    });
};

export const createReviewRepo = async (reviewData) => {
    return await prisma.review_Restaurant.create({
        data: reviewData
    });
};
