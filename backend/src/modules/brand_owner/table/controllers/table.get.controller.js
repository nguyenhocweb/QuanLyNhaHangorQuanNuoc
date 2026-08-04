import { asyncHandler } from "../../../../core/utils/asyncHandler.js";
import { getTablesByAreaIdService, getTableByIdService } from "../services/table.get.service.js";

export const getTablesByAreaId = asyncHandler(async (req, res) => {
    const { areaId } = req.params;
    const result = await getTablesByAreaIdService(areaId);
    res.status(200).json({
        success: true,
        data: result
    });
});

export const getTableById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await getTableByIdService(id);
    res.status(200).json({
        success: true,
        data: result
    });
});
