import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deleteAmenityRepo } from "../repositories/deleteAmenity.repo.js";
import { getAmenityByIdRepo } from "../repositories/getAmenity.repo.js";

export const deleteAmenityService = async (id) => {
    const exists = await getAmenityByIdRepo(id);
    if (!exists) throw new NotFoundError("Không tìm thấy dữ liệu");
    return deleteAmenityRepo(id);
};