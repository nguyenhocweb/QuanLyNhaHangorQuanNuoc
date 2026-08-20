import { activateApiKeyService } from "../services/api_key.activate.service.js";

export const activateApiKey = async (req, res) => {
  const { id } = req.params;
  await activateApiKeyService(id);
  
  res.status(200).json({
    message: "Đã kích hoạt lại API Key thành công"
  });
};
