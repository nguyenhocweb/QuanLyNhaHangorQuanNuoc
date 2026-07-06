import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { FindUsersBrandOwnerService } from "../service/FindUsersBrandOwner_service.js";

export const FindUsersBrandOwnerController = asyncHandler(async (req, res) => {
    const users = await FindUsersBrandOwnerService(req.query.search);
    return res.json(users);
});
