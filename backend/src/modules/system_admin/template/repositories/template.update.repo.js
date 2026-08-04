import { prisma } from "../../../../databases/init.mongodb.js";

export const updateTemplateByIdRepo = async (id, data) => {
    return prisma.template.update({
        where: { id },
        data,
    });
};

export const checkTemplateCodeExistForUpdateRepo = async (code, excludeId) => {
    return prisma.template.findFirst({
        where: {
            code,
            id: { not: excludeId },
        },
    });
};
