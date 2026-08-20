import { prisma } from "../../../../databases/init.mongodb.js";

const updateReply = async (id, staff_response) => {
    return prisma.review_Restaurant.update({
        where: { id },
        data: { staff_response }
    });
};
const findReviewById = async (id) => {
    return prisma.review_Restaurant.findUnique({ where: { id } });
};

export default { updateReply, findReviewById };