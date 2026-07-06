import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { cloudinarySignatureService } from "../service.cloudinary/cloudinarySignatureService.js";

export const cloudinarySignatureBulkController = asyncHandler(
    async (req, res) => {
        const { folder, public_ids } = req.query;

        const signaturesPromises = public_ids.map(public_id =>
            cloudinarySignatureService(folder, public_id)
        );
        const signaturesData = await Promise.all(signaturesPromises);
        res.status(200).json(signaturesData);
    }
)