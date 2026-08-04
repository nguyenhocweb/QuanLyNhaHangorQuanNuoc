import { prisma } from "../../../../databases/init.mongodb.js";
import { findUpgradeRequestById } from "../repositories/index.js";
import { BadRequestError, NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";

export const updateUpgradeRequestStatusService = async (id, status) => {
    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new BadRequestError("Trạng thái không hợp lệ");
    }

    const upgradeRequest = await findUpgradeRequestById(id);
    if (!upgradeRequest) {
        throw new NotFoundError("Không tìm thấy yêu cầu nâng cấp");
    }

    if (upgradeRequest.status === "APPROVED") {
        throw new ConflictError("Yêu cầu này đã được phê duyệt trước đó");
    }

    if (status === "REJECTED") {
        return await prisma.upgradeRequest.update({
            where: { id },
            data: { status: "REJECTED" }
        });
    }

    // Nếu APPROVED
    return await prisma.$transaction(async (tx) => {
        // Cập nhật trạng thái yêu cầu
        const updatedRequest = await tx.upgradeRequest.update({
            where: { id },
            data: { status: "APPROVED" }
        });

        // 1. Cập nhật role người dùng
        const brandOwnerRole = await tx.role.findUnique({
            where: { name: "Quản lý thương hiệu" }
        });
        if (!brandOwnerRole) {
            throw new BadRequestError("Hệ thống chưa cấu hình Role 'Quản lý thương hiệu'");
        }

        await tx.user.update({
            where: { id: upgradeRequest.userId },
            data: { roleId: brandOwnerRole.id }
        });

        // 2. Tạo Brand mới
        // Lấy gói miễn phí
        const freePlan = await tx.subscriptionPlan.findFirst({
            where: { price: 0 }
        });
        const freePlanId = freePlan ? freePlan.id : "60e9eb7a8d200d3b5098de40"; // Giá trị fallback nếu có (tốt nhất là DB phải có plan 0đ)

        // Lấy quyền BRAND
        const brandPermissions = await tx.permission.findMany({
            where: { type: "BRAND" }
        });
        const perVsEmpData = brandPermissions.map(p => ({
            permissionId: p.id
        }));

        // Kiểm tra xem user này đã có thương hiệu chưa (tránh lỗi conflict unique trên Brand name hoặc Employment)
        const existingBrand = await tx.brand.findUnique({
            where: { name: upgradeRequest.brandName }
        });
        if (existingBrand) {
            throw new ConflictError(`Thương hiệu mang tên '${upgradeRequest.brandName}' đã tồn tại trong hệ thống.`);
        }

        const newBrand = await tx.brand.create({
            data: {
                name: upgradeRequest.brandName,
                tax_code: upgradeRequest.tax_code,
                isActive: "ACTIVE", // Đã duyệt thì ACTIVE luôn
                subscriptions: {
                    create: [
                        {
                            planId: freePlanId,
                            status: "ACTIVE",
                            startDate: new Date(),
                            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 năm
                        }
                    ]
                },
                employments: {
                    create: [
                        {
                            userId: upgradeRequest.userId,
                            per_vs_emp: {
                                create: perVsEmpData
                            }
                        }
                    ]
                }
            }
        });

        return updatedRequest;
    });
};
