import { getApiKeysService } from "../services/api_key.get.service.js";

export const getApiKeys = async (req, res) => {
  const result = await getApiKeysService(req.query);
  
  res.status(200).json({
    message: "Lấy danh sách API Key thành công",
    metadata: result
  });
};
