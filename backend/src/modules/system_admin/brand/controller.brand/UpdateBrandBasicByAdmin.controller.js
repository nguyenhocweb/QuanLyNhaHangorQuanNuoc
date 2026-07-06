import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateBrandBasicByAdminService } from "../service.brand/updateBrandBasicByAdmin.service.js";

export const updateBrandBasicByAdminController = asyncHandler(
    async (req, res) => {
        const _id = req.params._id;
        const data = req.body;
        const result = await updateBrandBasicByAdminService(_id, data);

        return res.status(200).json({
            message: "Cập nhật thương hiệu thành công",
            id: result.id
        });
    }
);
