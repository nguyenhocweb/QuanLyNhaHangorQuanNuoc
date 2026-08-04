import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { getBrandOwnersService } from "../services/account.getBrandOwners.service.js";

export const getBrandOwnersController = asyncHandler(async (req, res) => {
    const users = await getBrandOwnersService(req.query.search);
    return res.json(users);
});
