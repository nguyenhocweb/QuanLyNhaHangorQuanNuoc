import { revokeApiKeyService } from "../services/api_key.revoke.service.js";

export const revokeApiKey = async (req, res) => {
  const { id } = req.params;
  await revokeApiKeyService(id);
  
  res.status(200).json({
    message: "Đã thu hồi API Key thành công"
  });
};
