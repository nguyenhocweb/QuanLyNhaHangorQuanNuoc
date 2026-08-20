import { prisma } from "../../../../databases/init.mongodb.js";

export const saveTableLayoutRepo = async (tablesData) => {
    // MongoDB Prisma does not support bulk update (updateMany) with different values per row easily.
    // So we use $transaction with individual updates.
    const updates = tablesData.map(table => {
        const { id, ...data } = table;
        return prisma.tables.update({
            where: { id },
            data
        });
    });
    
    return await prisma.$transaction(updates);
};
