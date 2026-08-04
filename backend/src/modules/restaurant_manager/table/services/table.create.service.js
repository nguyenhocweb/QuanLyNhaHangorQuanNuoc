import { BadRequestError, ConflictError } from "../../../../core/constants/error/index.js";
import { createTableRepo } from "../repositories/table.create.repo.js";
import { getRestaurantByIdRepo } from "../../../brand_owner/restaurant/repositories/restaurant.get.repo.js";
import { getAreaByIdRepo } from "../../area/repositories/area.get.repo.js";
import { checkTableNumberExistsRepo } from "../../../brand_owner/table/repositories/table.get.repo.js";
import crypto from "crypto";
import { emitTableUpdate } from "../../../../core/utils/socket.js";

export const createTableService = async (body) => {
    const { restaurantId, areaId, table_number } = body;
    
    // Validate Restaurant
    const restaurant = await getRestaurantByIdRepo({ id: restaurantId });
    if (!restaurant) throw new BadRequestError("Nhà hàng không tồn tại");

    // Validate Area
    const area = await getAreaByIdRepo(areaId);
    if (!area) throw new BadRequestError("Khu vực không tồn tại");
    if (area.restaurantId !== restaurantId) throw new BadRequestError("Khu vực không thuộc nhà hàng này");

    // Validate Unique Table Number
    const existingTable = await checkTableNumberExistsRepo(restaurantId, table_number);
    if (existingTable) throw new ConflictError("Tên/Số bàn đã tồn tại trong nhà hàng này");

    // Tự động sinh qr_code duy nhất nếu không có
    if (!body.qr_code) {
        body.qr_code = `QR_${restaurantId}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    }

    const result = await createTableRepo(body);
    emitTableUpdate(restaurantId);
    return result;
};
