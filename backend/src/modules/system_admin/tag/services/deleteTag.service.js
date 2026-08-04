import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deleteTagRepo } from "../repositories/deleteTag.repo.js";
import { getTagByIdRepo } from "../repositories/getTag.repo.js";

export const deleteTagService = async (id) => {
    const exists = await getTagByIdRepo(id);
    if (!exists) throw new NotFoundError("Không tìm thấy dữ liệu");
    return deleteTagRepo(id);
};