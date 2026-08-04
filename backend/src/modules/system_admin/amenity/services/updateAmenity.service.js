import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { updateAmenityRepo } from "../repositories/updateAmenity.repo.js";
import { getAmenityByIdRepo, getAmenityByNameRepo } from "../repositories/getAmenity.repo.js";

export const updateAmenityService = async (id, data) => {
    const exists = await getAmenityByIdRepo(id);
    if (!exists) throw new NotFoundError("Không tìm thấy dữ liệu");

    if (data.name && data.name !== exists.name) {
        const nameExists = await getAmenityByNameRepo(data.name);
        if (nameExists) throw new ConflictError("Tên đã tồn tại");
    }

    return updateAmenityRepo(id, data);
};