import { NotFoundError } from "../../../../core/constants/error/index.js";
import { deleteTableRepo } from "../repositories/table.delete.repo.js";
import { getTableByIdRepo } from "../repositories/table.get.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const deleteTableService = async (id) => {
    const table = await getTableByIdRepo(id);
    if (!table) throw new NotFoundError("Bàn không tồn tại");

    const result = await deleteTableRepo(id);
    emitTableUpdate(table.restaurantId);
    return result;
};
