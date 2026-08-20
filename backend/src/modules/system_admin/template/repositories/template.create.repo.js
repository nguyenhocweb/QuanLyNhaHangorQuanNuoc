import { prisma } from "../../../../databases/init.mongodb.js";

export const createTemplateRepo = async (data) => {
    return prisma.template.create({
        data,
    });
};
