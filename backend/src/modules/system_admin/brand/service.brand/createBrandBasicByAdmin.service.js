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

    // Lấy danh sách các quyền của cấp độ Thương hiệu (BRAND)
    const brandPermissions = await prisma.permission.findMany({
        where: { type: "BRAND" }
    });
    
    // Chuẩn bị dữ liệu phân quyền
    const perVsEmpData = brandPermissions.map(p => ({
        permissionId: p.id
    }));

    const payload = {
        name: data.name,
        taxCode: data.taxCode,
        description: data.description,
        emailContact: data.emailContact,
        phoneContact: data.phoneContact,
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
        },
        employments: {
            create: [
                {
                    userId: data.brand_owner_id,
                    per_vs_emp: {
                        create: perVsEmpData
                    }
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
            const target = error.meta?.target;
            if (target && target.includes("userId")) {
                throw new ConflictError("Người dùng này đã được phân quyền ở một thương hiệu hoặc hệ thống khác (Lỗi trùng lặp Employment)");
            }
            throw new ConflictError("Tên thương hiệu đã tồn tại (Lỗi trùng lặp tên)");
        }
        throw new BadRequestError("Tạo thương hiệu không thành công: " + error.message);
    }
};
