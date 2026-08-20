import { prisma } from "../../../../databases/init.mongodb.js";

const updateStatus = async (id, status) => {
    return prisma.review_Restaurant.update({
        where: { id },
        data: { status }
    });
};

export default { updateStatus };