import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createCategoryRestaurantService } from "../services/createCategory.service.js";

export const createCategoryRestaurantController = asyncHandler(async (req, res) => {
    const data = await createCategoryRestaurantService(req.body);
    return res.status(201).json({
        message: "Tạo loại hình nhà hàng thành công",
        data
    });
});
