import { fetchSortedApiKeys, updateKeyAuditTrail } from "./api_key_fetcher.js";
import { decryptKey } from "../../../../core/utils/apiKey.utils.js";
import { GeminiProvider } from "./providers/gemini.provider.js";
import { OpenAIProvider } from "./providers/openai.provider.js";
import { ClaudeProvider } from "./providers/claude.provider.js";

// Factory map các provider
const providersMap = {
  'GEMINI': GeminiProvider,
  'OPENAI': OpenAIProvider,
  'CLAUDE': ClaudeProvider,
};

/**
 * Định tuyến AI tự động (Failover Router)
 * @param {string} brandId - ID Thương hiệu đang gọi
 * @param {string} systemPrompt - Câu lệnh hệ thống (Đã nhúng RAG Context)
 * @param {string} userMessage - Tin nhắn từ user
 * @param {Array} tools - Danh sách function calls (Tùy chọn)
 * @param {Array} chatHistory - Lịch sử trò chuyện
 */
export const routeAiRequest = async (brandId, systemPrompt, userMessage, tools, chatHistory = []) => {
  // 1. Lấy danh sách Key khả dụng đã được sắp xếp ưu tiên
  const apiKeys = await fetchSortedApiKeys(brandId);
  
  let lastError = null;
  const MAX_ATTEMPTS = apiKeys.length;

  // 2. Vòng lặp Failover Thần Thánh
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const apiKeyData = apiKeys[i];
    
    try {
      const providerName = apiKeyData.chatbox.name.toUpperCase();
      const ProviderClass = providersMap[providerName];

      if (!ProviderClass) {
        console.warn(`[Router] Provider ${providerName} chưa được hỗ trợ. Bỏ qua Key này.`);
        continue;
      }

      const modelName = apiKeyData.restrictedModel?.name || process.env.AI_MODEL_FLASH; // Lấy từ cấu hình môi trường nếu Key không giới hạn
      const decryptedKey = decryptKey(apiKeyData.encryptedKey);

      console.log(`[Router] Đang thử gọi AI qua Provider: ${providerName}, Key: ${apiKeyData.name}...`);

      // 3. Gọi Adapter
      const aiResponse = await ProviderClass.generateContent(
        decryptedKey, 
        modelName, 
        systemPrompt, 
        userMessage, 
        tools,
        chatHistory
      );

      // 4. Fire-and-forget Audit Log (Không dùng await để tối ưu hiệu suất)
      updateKeyAuditTrail(apiKeyData.id).catch(err => console.error("[Audit Log Error]", err.message));
      
      return {
        aiResponse,
        provider: ProviderClass,
        usedKeyId: apiKeyData.id
      };

    } catch (error) {
      lastError = error;
      
      // Bắt lỗi 503 hoặc các lỗi Rate Limit (429) để tự động Failover
      const isOverloadedOrRateLimited = error?.status === 503 || error?.status === 429 || error?.message?.includes('503') || error?.message?.includes('429') || error?.message?.includes('quota');
      
      if (isOverloadedOrRateLimited) {
        console.warn(`[Failover] Gọi bằng key '${apiKeyData.name}' thất bại (Lỗi Quota/Bận). Chuyển sang Key dự phòng tiếp theo...`);
        continue; // LỖI -> Đi tới vòng lặp tiếp theo (Thử Key khác)
      } else {
        // Lỗi 400 (Bad Request) hoặc 404 (Model Not Found)
        // Lưu ý: 404 Model Not Found có thể do cấu hình của Key này bị sai, NÊN failover sang key khác (có thể cấu hình model đúng).
        // Chúng ta log lỗi mức Error để Dev biết, nhưng VẪN tiếp tục vòng lặp để cứu request của User.
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
          console.error(`[Router Error] Lỗi cấu hình/dữ liệu với key '${apiKeyData.name}' (Model: ${apiKeyData.restrictedModel?.name || process.env.AI_MODEL_FLASH}):`, error.message);
          // KHÔNG throw error ở đây nữa, cho phép continue để thử Key dự phòng
        } else {
          console.warn(`[Failover] Lỗi không xác định với key '${apiKeyData.name}':`, error.message);
        }
        continue;
      }
    }
  }

  // 3. Nếu chạy hết vòng lặp mà vẫn không return được (Toàn bộ Key đều lỗi)
  console.error(`[Thất bại] Đã thử ${MAX_ATTEMPTS} API Keys nhưng tất cả đều lỗi.`);
  throw new Error("Hệ thống AI hiện đang bận hoặc tất cả các API Key dự phòng đều đã hết hạn mức. Vui lòng thử lại sau!");
};
