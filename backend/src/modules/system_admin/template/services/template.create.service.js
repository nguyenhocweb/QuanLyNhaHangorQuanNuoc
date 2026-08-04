import { ConflictError } from "../../../../core/constants/error/index.js";
import { createTemplateRepo } from "../repositories/template.create.repo.js";
import { getTemplateByCodeRepo } from "../repositories/template.get.repo.js";

export const createTemplateService = async (data) => {
    // Kiểm tra code đã tồn tại chưa
    const existing = await getTemplateByCodeRepo(data.code);
    if (existing) {
        throw new ConflictError("Mã code giao diện đã tồn tại trong hệ thống.");
    }

    const template = await createTemplateRepo(data);
    return { code: 201, message: "Tạo mới thành công", metadata: template };
};
