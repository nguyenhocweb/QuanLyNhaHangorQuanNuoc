import { createApiKeyService } from "../services/api_key.create.service.js";

export const createApiKey = async (req, res) => {
  const adminId = req.user.id;
  const result = await createApiKeyService(adminId, req.body);
  
  res.status(201).json({
    message: "Tạo API Key thành công. Vui lòng copy chuỗi Key vì nó sẽ không hiển thị lại.",
    metadata: result
  });
};
