import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { updateTagRepo } from "../repositories/updateTag.repo.js";
import { getTagByIdRepo, getTagByNameRepo } from "../repositories/getTag.repo.js";

export const updateTagService = async (id, data) => {
    const exists = await getTagByIdRepo(id);
    if (!exists) throw new NotFoundError("Không tìm thấy dữ liệu");

    if (data.name && data.name !== exists.name) {
        const nameExists = await getTagByNameRepo(data.name);
        if (nameExists) throw new ConflictError("Tên đã tồn tại");
    }

    return updateTagRepo(id, data);
};