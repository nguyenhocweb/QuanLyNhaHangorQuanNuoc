import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { createBrandImagesService } from "../service.brand/createBrandImages.service.js";

export const createBrandImagesController = asyncHandler(
    async (req, res) => {
        const _id = req.params._id;
        const data = req.body;

        const result = await createBrandImagesService(_id, data);
        return res.status(200).json(result);
    }
);
