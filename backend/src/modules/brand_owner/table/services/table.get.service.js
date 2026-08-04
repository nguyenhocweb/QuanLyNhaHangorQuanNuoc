import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";
import { getTablesByAreaIdRepo, getTableByIdRepo } from "../repositories/table.get.repo.js";

export const getTablesByAreaIdService = async (areaId) => {
    if (!areaId) throw new BadRequestError("areaId là bắt buộc");
    return await getTablesByAreaIdRepo(areaId);
};

export const getTableByIdService = async (id) => {
    const table = await getTableByIdRepo(id);
    if (!table) throw new NotFoundError("Bàn không tồn tại");
    return table;
};
