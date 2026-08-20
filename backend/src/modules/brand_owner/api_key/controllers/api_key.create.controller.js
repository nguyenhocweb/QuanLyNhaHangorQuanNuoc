import { createApiKeyService } from "../../../system_admin/api_key/services/api_key.create.service.js";
import { ForbiddenError } from "../../../../core/constants/error/index.js";

export const createBrandApiKey = async (req, res) => {
  const brandOwnerId = req.user.id;
  const brandId = req.params.id_brand;
  
  if (!brandId) {
    throw new ForbiddenError("Không xác định được thương hiệu");
  }

  // Ép buộc brandId vào payload để tránh tạo Global Key
  const payload = {
    ...req.body,
    brandId,
    keyType: 'BRAND'
  };

  const result = await createApiKeyService(brandOwnerId, payload);
  
  res.status(201).json({
    message: "Tạo API Key thành công. Vui lòng copy chuỗi Key vì nó sẽ không hiển thị lại.",
    metadata: result
  });
};
