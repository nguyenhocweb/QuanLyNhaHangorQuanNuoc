import { ConflictError } from "../../../../core/constants/error/index.js";
import { getTagByNameRepo } from "../repositories/getTag.repo.js";
import { createTagRepo as createRepo } from "../repositories/createTag.repo.js";

export const createTagService = async (data) => {
    const exists = await getTagByNameRepo(data.name);
    if (exists) throw new ConflictError("Tên đã tồn tại");
    return createRepo(data);
};