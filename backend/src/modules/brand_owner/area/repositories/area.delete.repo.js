import { prisma } from "../../../../databases/init.mongodb.js";

export const deleteAreaRepo = async (id) => {
    return await prisma.restaurant_Areas.update({
        where: { id },
        data: { is_active: "TERMINATED" }
    });
};
