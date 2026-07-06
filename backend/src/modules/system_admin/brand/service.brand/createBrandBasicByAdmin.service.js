import { createBrand } from "../repository.brand/index.js";
import { BadRequestError, ConflictError } from "../../../../core/constants/error/index.js";
import { Prisma } from "../../../../databases/prisma/generated/prisma/index.js";

import { prisma } from "../../../../databases/init.mongodb.js";

export const createBrandBasicByAdminService = async (data) => {
    // Tìm gói miễn phí (giá = 0)
    const freePlan = await prisma.subscriptionPlan.findFirst({
        where: { price: 0 }
    });
    const freePlanId = freePlan ? freePlan.id : "60e9eb7a8d200d3b5098de40";

    const payload = {
        name: data.name,
        tax_code: data.tax_code,
        description: data.description,
        email_contact: data.email_contact,
        phone_contact: data.phone_contact,
        link: data.link,
        address: data.address,
        isFeatured: data.is_featured,
        isActive: "ACTIVE",
        subscriptions: {
            create: [
                {
                    planId: freePlanId,
                    status: "ACTIVE",
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 năm mặc định
                }
            ]
        }
    };

    try {
        const id = await createBrand(payload);
        if (!id) {
            throw new BadRequestError("Tạo thương hiệu không thành công");
        }
        return { id };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new ConflictError("Thương hiệu đã tồn tại");
        }
        throw new BadRequestError("Tạo thương hiệu không thành công");
    }
};
