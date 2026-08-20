import { getApiKeysService } from "../../../system_admin/api_key/services/api_key.get.service.js";

export const getBrandApiKeys = async (req, res) => {
  const brandId = req.params.id_brand;
  const query = {
    ...req.query,
    brandId // Ép buộc query chỉ lấy key của brand này
  };

  const result = await getApiKeysService(query);
  
  res.status(200).json({
    message: "Lấy danh sách API Key thành công",
    metadata: result
  });
};
