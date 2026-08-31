import { prisma } from "../../../../databases/init.mongodb.js";
import { findUpgradeRequestById } from "../repositories/index.js";
import { BadRequestError, NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { emitUserPermissionUpdate, emitBrandSubscriptionUpdate } from "../../../../core/utils/socket.js";

export const updateUpgradeRequestStatusService = async (id, status, planId, rejectionReason) => {
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
            data: { 
                status: "REJECTED",
                rejectionReason: rejectionReason || "Hồ sơ chưa đạt yêu cầu của hệ thống."
            }
        });
    }

    // Nếu APPROVED
    const result = await prisma.$transaction(async (tx) => {
        // Cập nhật trạng thái yêu cầu
        const updatedRequest = await tx.upgradeRequest.update({
            where: { id },
            data: { 
                status: "APPROVED",
                rejectionReason: null
            }
        });

        // 1. Cập nhật role người dùng (Lấy role cho Workspace)
        const brandOwnerRole = await tx.workspaceRole.findUnique({
            where: { name: "Quản lý thương hiệu" }
        });
        if (!brandOwnerRole) {
            throw new BadRequestError("Hệ thống chưa cấu hình WorkspaceRole 'Quản lý thương hiệu'");
        }

        // 2. Tạo Brand mới
        // Lấy gói cước (Dựa vào planId hoặc fallback lấy gói 0đ)
        let selectedPlan = null;
        if (planId) {
            selectedPlan = await tx.subscriptionPlan.findUnique({
                where: { id: planId }
            });
            if (!selectedPlan) {
                throw new BadRequestError("Gói cước được chọn không tồn tại.");
            }
        } else {
            selectedPlan = await tx.subscriptionPlan.findFirst({
                where: { price: 0 }
            });
            if (!selectedPlan) {
                throw new BadRequestError("Hệ thống chưa có Gói cước Miễn phí (0đ). Vui lòng yêu cầu Admin tạo gói cước trước hoặc chọn thủ công một gói.");
            }
        }

        // Lấy quyền BRAND
        const brandPermissions = await tx.permission.findMany({
            where: { type: "BRAND" }
        });
        const perVsEmpData = brandPermissions.map(p => ({
            permissionId: p.id
        }));

        // Kiểm tra xem user này đã có thương hiệu trùng tên chưa
        const existingBrand = await tx.brand.findUnique({
            where: { name: upgradeRequest.brandName }
        });
        if (existingBrand) {
            throw new ConflictError(`Thương hiệu mang tên '${upgradeRequest.brandName}' đã tồn tại trong hệ thống.`);
        }

        const newBrand = await tx.brand.create({
            data: {
                name: upgradeRequest.brandName,
                logo: upgradeRequest.logo || null,
                description: upgradeRequest.description || null,
                tax_code: upgradeRequest.tax_code || null,
                phone_contact: upgradeRequest.phone_contact || null,
                email_contact: upgradeRequest.email_contact || null,
                address: upgradeRequest.address || null,
                imageMain: upgradeRequest.logo || upgradeRequest.user?.avatar || "https://res.cloudinary.com/demo/image/upload/v1/default_brand.jpg",
                isActive: "ACTIVE", // Đã duyệt thì ACTIVE luôn
                subscriptions: {
                    create: [
                        {
                            planId: selectedPlan.id,
                            status: "ACTIVE",
                            startDate: new Date(),
                            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 năm
                            // Áp dụng chuẩn Snapshot Data
                            planName: selectedPlan.name,
                            price: selectedPlan.price,
                            maxRestaurants: selectedPlan.maxRestaurants,
                            featuresData: selectedPlan.featuresData,
                        }
                    ]
                },
                employments: {
                    create: [
                        {
                            userId: upgradeRequest.userId,
                            workspaceRoleId: brandOwnerRole.id, // Lưu role cụ thể cho nơi làm việc này
                            per_vs_emp: {
                                create: perVsEmpData
                            }
                        }
                    ]
                }
            }
        });

        return { updatedRequest, newBrand };
    });

    // Emit Socket tới máy User để Frontend tự gọi API Refresh Data
    emitUserPermissionUpdate(upgradeRequest.userId);
    emitBrandSubscriptionUpdate(result.newBrand.id);

    return result;
};
