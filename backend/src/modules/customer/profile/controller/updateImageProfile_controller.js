import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { updateImageProfileService } from "../service/updateImageProfile_service.js";
export const updateImageProfileController = asyncHandler(
    async (req, res) => {
    const { urlAvatar, id}=req.body
      const avatarUrl = await updateImageProfileService(id,urlAvatar);
  
      
      return res.json({ avatar: avatarUrl.avatar });
    }
)
 