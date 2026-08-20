import { activateApiKeyService } from "../../../system_admin/api_key/services/api_key.activate.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const activateBrandApiKey = async (req, res) => {
  const { id } = req.params;
  const brandId = req.params.id_brand;

  // Xác minh Key này thuộc về Brand trước khi activate
  const key = await prisma.apiKey.findFirst({
    where: { id, brandId }
  });

  if (!key) {
    throw new ForbiddenError("Không tìm thấy API Key hoặc bạn không có quyền kích hoạt Key này");
  }

  await activateApiKeyService(id);
  
  res.status(200).json({
    message: "Đã kích hoạt lại API Key thành công"
  });
};
