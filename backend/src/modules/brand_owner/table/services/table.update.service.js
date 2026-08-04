import { NotFoundError, ConflictError } from "../../../../core/constants/error/index.js";
import { updateTableRepo } from "../repositories/table.update.repo.js";
import { getTableByIdRepo, checkTableNumberExistsRepo } from "../repositories/table.get.repo.js";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const updateTableService = async (id, body) => {
    const table = await getTableByIdRepo(id);
    if (!table) throw new NotFoundError("Bàn không tồn tại");

    // Check if updating table_number and it already exists
    if (body.table_number && body.table_number !== table.table_number) {
        const existingTable = await checkTableNumberExistsRepo(table.restaurantId, body.table_number);
        if (existingTable) throw new ConflictError("Tên/Số bàn đã tồn tại trong nhà hàng này");
    }

    const result = await updateTableRepo(id, body);
    emitTableUpdate(table.restaurantId);
    return result;
};
