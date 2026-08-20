import { revokeApiKeyService } from "../../../system_admin/api_key/services/api_key.revoke.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const revokeBrandApiKey = async (req, res) => {
  const { id } = req.params;
  const brandId = req.params.id_brand;

  // Xác minh Key này thuộc về Brand trước khi revoke
  const key = await prisma.apiKey.findFirst({
    where: { id, brandId }
  });

  if (!key) {
    throw new ForbiddenError("Không tìm thấy API Key hoặc bạn không có quyền thu hồi Key này");
  }

  await revokeApiKeyService(id);
  
  res.status(200).json({
    message: "Đã thu hồi API Key thành công"
  });
};
