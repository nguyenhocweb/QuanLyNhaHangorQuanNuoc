import { NotFoundError, ForbiddenError } from "../../../../core/constants/error/index.js";
import { findEmploymentByUserId } from "../../brand/repositories/brand.get.repo.js";
import { getTemplateByIdRepo, getActiveSubscriptionByBrandRepo, updateRestaurantTemplateRepo } from "../repositories/updateRestaurantTemplate.repo.js";

export const updateRestaurantTemplateService = async (userId, templateId) => {
    // 0. Resolve brandId từ DB thông qua employment
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    // 1. Kiểm tra template có tồn tại
    const template = await getTemplateByIdRepo(templateId);
    if (!template) {
        throw new NotFoundError("Mẫu giao diện không tồn tại.");
    }
    if (!template.isActive) {
        throw new ForbiddenError("Mẫu giao diện này đang bị khoá.");
    }

    // 2. Kiểm tra quyền lợi gói cước
    // Nếu allowedPlanIds.length > 0 => Giao diện Premium/Luxury
    if (template.allowedPlanIds && template.allowedPlanIds.length > 0) {
        const activeSub = await getActiveSubscriptionByBrandRepo(brandId);
        
        if (!activeSub) {
            throw new ForbiddenError("Mẫu giao diện này thuộc gói cước trả phí. Bạn chưa đăng ký gói cước nào.");
        }

        const isAllowed = template.allowedPlanIds.includes(activeSub.planId);
        if (!isAllowed) {
            throw new ForbiddenError(`Mẫu giao diện này không được hỗ trợ trong gói cước "${activeSub.plan?.name || "hiện tại"}" của bạn. Vui lòng nâng cấp.`);
        }
    }

    // 3. Cập nhật cho tất cả nhà hàng của brand
    await updateRestaurantTemplateRepo(brandId, templateId);

    return {
        code: 200,
        message: "Cập nhật mẫu giao diện chi nhánh thành công.",
    };
};
