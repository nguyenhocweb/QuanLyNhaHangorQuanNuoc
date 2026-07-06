import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createBrandBasicByAdminService } from "../service.brand/createBrandBasicByAdmin.service.js";

export const createBrandBasicByAdminController = asyncHandler(
    async (req, res) => {
        const data = req.body;
        const result = await createBrandBasicByAdminService(data);

        return res.status(201).json({
            id: result.id
        });
    }
);
