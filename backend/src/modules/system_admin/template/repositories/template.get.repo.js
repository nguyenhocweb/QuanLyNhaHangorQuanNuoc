import { prisma } from "../../../../databases/init.mongodb.js";

export const getTemplatesRepo = async ({ where, skip, take }) => {
    return prisma.template.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
    });
};

export const getTemplateByCodeRepo = async (code) => {
    return prisma.template.findUnique({
        where: { code },
    });
};

export const getTemplateByIdRepo = async (id) => {
    return prisma.template.findUnique({
        where: { id },
    });
};
