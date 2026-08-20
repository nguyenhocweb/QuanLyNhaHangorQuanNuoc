import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getTemplateByIdRepo } from "../repositories/template.get.repo.js";
import { deleteTemplateByIdRepo, checkTemplateUsageRepo } from "../repositories/template.delete.repo.js";

export const deleteTemplateService = async (id) => {
    // 1. Kiểm tra tồn tại
    const existing = await getTemplateByIdRepo(id);
    if (!existing) {
        throw new NotFoundError("Mẫu giao diện không tồn tại.");
    }

    // 2. Kiểm tra có đang được sử dụng không
    const usage = await checkTemplateUsageRepo(id);
    if (usage.brandCount > 0 || usage.restaurantCount > 0) {
        throw new ConflictError("Không thể xoá Mẫu giao diện này vì đang có Thương hiệu hoặc Nhà hàng sử dụng. Vui lòng chuyển trạng thái thành ngưng hoạt động (isActive = false) thay vì xoá.");
    }

    // 3. Xóa
    await deleteTemplateByIdRepo(id);

    return {
        code: 200,
        message: "Xoá mẫu giao diện thành công.",
    };
};
