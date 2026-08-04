import { ConflictError } from "../../../../core/constants/error/index.js";
import { getAmenityByNameRepo } from "../repositories/getAmenity.repo.js";
import { createAmenityRepo as createRepo } from "../repositories/createAmenity.repo.js";

export const createAmenityService = async (data) => {
    const exists = await getAmenityByNameRepo(data.name);
    if (exists) throw new ConflictError("Tên đã tồn tại");
    return createRepo(data);
};