import { prisma } from "../../../../../databases/init.mongodb.js";

export const deleteCategoryRepo = async (id) => {
    return prisma.menuCategory.delete({
        where: { id }
    });
};
