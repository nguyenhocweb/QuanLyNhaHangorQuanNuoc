import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { updateTemplateByIdRepo, checkTemplateCodeExistForUpdateRepo } from "../repositories/template.update.repo.js";
import { getTemplateByIdRepo } from "../repositories/template.get.repo.js";

export const updateTemplateService = async (id, data) => {
    // 1. Kiểm tra tồn tại
    const existing = await getTemplateByIdRepo(id);
    if (!existing) {
        throw new NotFoundError("Mẫu giao diện không tồn tại.");
    }

    // 2. Nếu đổi code, kiểm tra trùng lặp
    if (data.code && data.code !== existing.code) {
        const isConflict = await checkTemplateCodeExistForUpdateRepo(data.code, id);
        if (isConflict) {
            throw new ConflictError("Mã code giao diện này đã tồn tại trong hệ thống.");
        }
    }

    // 3. Cập nhật
    const updated = await updateTemplateByIdRepo(id, data);

    return {
        code: 200,
        message: "Cập nhật mẫu giao diện thành công.",
        metadata: updated,
    };
};
