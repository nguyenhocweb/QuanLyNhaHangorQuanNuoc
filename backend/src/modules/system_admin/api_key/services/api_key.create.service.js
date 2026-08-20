import { createApiKeyRepo } from "../repositories/api_key.create.repo.js";
import { generateApiKey, hashApiKey, getApiKeyPrefix, encryptKey } from "../../../../core/utils/apiKey.utils.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const createApiKeyService = async (adminId, data) => {
  const { name, contactEmail, brandId, keyType, chatboxId, restrictedModelId, expiresInDays, providedKey } = data;

  if (!name) {
    throw new BadRequestError("Vui lòng nhập tên API Key");
  }
  if (!providedKey) {
    throw new BadRequestError("Vui lòng nhập API Key thực tế (của OpenAI/Gemini...)");
  }
  if (!chatboxId) {
    throw new BadRequestError("Vui lòng chọn nhà cung cấp AI (Chatbox ID)");
  }

  const rawKey = generateApiKey(); // Dummy key for backwards compatibility if needed
  const keyHash = hashApiKey(rawKey);
  const prefix = getApiKeyPrefix(providedKey); // Lấy prefix hiển thị
  const encryptedKey = encryptKey(providedKey);

  let expiresAt = null;
  if (expiresInDays) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));
  }

  const newKey = await createApiKeyRepo({
    keyHash,
    prefix,
    name,
    contactEmail,
    brandId: brandId || null, 
    keyType: keyType || 'BRAND', 
    chatboxId: chatboxId,
    restrictedModelId: restrictedModelId || null,
    encryptedKey
  });

  return {
    id: newKey.id,
    name: newKey.name,
    prefix: newKey.prefix
  };
};
