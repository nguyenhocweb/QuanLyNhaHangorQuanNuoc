import asyncHandle from "../../../../core/utils/asyncHandler.js";
import { getAreasWithTablesService } from "../services/table.get.service.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const getAreasWithTablesController = asyncHandle(
    async (req, res) => {
        const restaurantId = req.params.restaurantId;
        
        if (!restaurantId) {
            throw new BadRequestError("Thiếu thông tin chi nhánh (restaurantId)");
        }

        const data = await getAreasWithTablesService(restaurantId);
        
        return res.status(200).json({
            message: "Lấy sơ đồ bàn thành công",
            data: data
        });
    }
);
