import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updateAreaRepo } from "../repositories/area.update.repo.js";
import { getAreaByIdRepo } from "../repositories/area.get.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const updateAreaService = async (id, body) => {
    const area = await getAreaByIdRepo(id);
    if (!area) throw new NotFoundError("Khu vực không tồn tại");

    const result = await updateAreaRepo(id, body);
    emitTableUpdate(area.restaurantId);
    return result;
};
