import { NotFoundError, BadRequestError } from "../../../../core/constants/error/index.js";
import { deleteAreaRepo } from "../repositories/area.delete.repo.js";
import { getAreaByIdRepo } from "../repositories/area.get.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const deleteAreaService = async (id) => {
    const area = await getAreaByIdRepo(id);
    if (!area) throw new NotFoundError("Khu vực không tồn tại");
    if (area.is_active === "TERMINATED") throw new BadRequestError("Khu vực đã bị xóa");

    const result = await deleteAreaRepo(id);
    emitTableUpdate(area.restaurantId);
    return result;
};
