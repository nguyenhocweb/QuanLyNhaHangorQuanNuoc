import { updateApiKeyService } from "../services/api_key.update.service.js";

export const updateGlobalApiKey = async (req, res) => {
  const keyId = req.params.id;
  // System Admin có thể cập nhật bất kỳ key nào (hoặc ít nhất là Global Keys).
  // Vì trong api_key.update.service.js có kiểm tra brandId, nếu brandId undefined thì nó vẫn khớp nếu API Key đó không thuộc brand nào?
  // Cần kiểm tra kỹ lại `updateApiKeyRepo` của system_admin.
  // Trong `api_key.update.repo.js`, tôi đã sửa thành `brandId`. Nếu là global key thì brandId là null.
  // Bỏ qua check brandId vì admin có quyền update
  const result = await updateApiKeyService(keyId, undefined, req.body);
  
  res.status(200).json({
    message: "Cập nhật API Key thành công",
    metadata: result
  });
};
