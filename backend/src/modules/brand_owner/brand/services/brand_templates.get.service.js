import { findEmploymentByUserId } from "../repositories/brand.get.repo.js";
import { getAllActiveTemplatesRepo, getActiveSubscriptionByBrandRepo } from "../repositories/brand_templates.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getBrandTemplatesService = async (userId) => {
    // 1. Resolve brandId từ DB thông qua employment
    const employment = await findEmploymentByUserId(userId);
    if (!employment || !employment.brandId) {
        throw new NotFoundError("Bạn chưa được gán quyền chủ thương hiệu hoặc không tìm thấy thương hiệu.");
    }
    const brandId = employment.brandId;

    // 2. Lấy danh sách templates
    const templates = await getAllActiveTemplatesRepo();
    const activeSub = await getActiveSubscriptionByBrandRepo(brandId);
    
    // 3. Đánh giá trạng thái isUnlocked cho từng template
    const templatesWithUnlockStatus = templates.map(template => {
        let isUnlocked = false;
        
        // Nếu template không yêu cầu gói cước nào thì mặc định mở khóa
        if (!template.allowedPlanIds || template.allowedPlanIds.length === 0) {
            isUnlocked = true;
        } else {
            // Nếu có yêu cầu gói cước, kiểm tra xem brand có đang dùng gói cước phù hợp không
            if (activeSub && template.allowedPlanIds.includes(activeSub.planId)) {
                isUnlocked = true;
            }
        }
        
        return {
            ...template,
            isUnlocked
        };
    });

    return {
        code: 200,
        message: "Lấy danh sách mẫu giao diện thành công.",
        metadata: templatesWithUnlockStatus
    };
};
