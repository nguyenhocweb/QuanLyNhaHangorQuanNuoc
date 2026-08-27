import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { assignTableService, unassignTableService } from "../services/reservation.assign.service.js";

export const assignTable = asyncHandler(async (req, res) => {
    const { restaurantId, id } = req.params;
    const staffId = req.user.id;
    const { tableId } = req.body;
    
    const result = await assignTableService(id, restaurantId, tableId, staffId);
    
    res.status(200).json({
        message: "Xếp bàn thành công",
        metadata: result
    });
});

export const unassignTable = asyncHandler(async (req, res) => {
    const { restaurantId, id, tableId } = req.params;
    
    const result = await unassignTableService(id, restaurantId, tableId);
    
    res.status(200).json({
        message: "Huỷ xếp bàn thành công",
        metadata: result
    });
});
