import { getTemplatesRepo } from "../repositories/template.get.repo.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const getTemplatesService = async (query) => {
    const { page = 1, limit = 10, type, isActive } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === "true";

    const [templates, total] = await Promise.all([
        getTemplatesRepo({ where, skip, take: Number(limit) }),
        prisma.template.count({ where }),
    ]);

    return {
        code: 200,
        message: "Lấy danh sách mẫu giao diện thành công",
        metadata: templates,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
    };
};
