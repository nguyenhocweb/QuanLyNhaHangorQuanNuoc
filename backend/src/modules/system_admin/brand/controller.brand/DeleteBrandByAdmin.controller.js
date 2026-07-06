import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { deleteBrandByAdminService } from "../service.brand/deleteBrandByAdmin.service.js";

export const deleteBrandByAdminController = asyncHandler(
    async (req, res) => {
        const _id = req.params._id;
        const result = await deleteBrandByAdminService(_id);

        return res.status(200).json({
            message: "Xóa (chấm dứt) thương hiệu thành công",
            id: result.id
        });
    }
);
