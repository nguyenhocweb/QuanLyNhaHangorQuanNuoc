import { updateApiKeyService } from "../../../system_admin/api_key/services/api_key.update.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const updateBrandApiKey = async (req, res) => {
  const brandId = req.params.id_brand;
  const keyId = req.params.id;
  
  if (!brandId) {
    throw new ForbiddenError("Không xác định được thương hiệu");
  }

  const result = await updateApiKeyService(keyId, brandId, req.body);
  
  res.status(200).json({
    message: "Cập nhật API Key thành công",
    metadata: result
  });
};
