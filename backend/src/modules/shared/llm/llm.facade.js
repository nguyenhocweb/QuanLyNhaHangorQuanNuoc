import { AIMemoryService } from "./core/memory.service.js";
import { RAGEngine } from "./core/rag.engine.js";
import { FunctionCaller } from "./core/function_caller.js";
import { routeAiRequest } from "./gateway/ai_router.service.js";

/**
 * Hàm lấy cấu hình Persona động
 */
const getPersonaConfig = async (role) => {
  switch (role) {
    case 'CUSTOMER':
    case 'customer':
      return await import('./personas/customer/index.js').catch(() => import('./personas/customer/prompt.js').then(p => import('./personas/customer/tools.js').then(t => ({...p, ...t}))));
    case 'Nhân viên':
    case 'Quản lý nhà hàng':
    case 'manager':
      return await import('./personas/manager/index.js').catch(() => import('./personas/manager/prompt.js').then(p => import('./personas/manager/tools.js').then(t => ({...p, ...t}))));
    case 'Quản lý thương hiệu':
    case 'BRAND_OWNER':
    case 'owner':
      return await import('./personas/owner/index.js').catch(() => import('./personas/owner/prompt.js').then(p => import('./personas/owner/tools.js').then(t => ({...p, ...t}))));
    case 'Admin':
    case 'SYSTEM_ADMIN':
    case 'admin':
      return await import('./personas/admin/index.js').catch(() => import('./personas/admin/prompt.js').then(p => import('./personas/admin/tools.js').then(t => ({...p, ...t}))));
    default:
      return await import('./personas/customer/index.js').catch(() => import('./personas/customer/prompt.js').then(p => import('./personas/customer/tools.js').then(t => ({...p, ...t}))));
  }
};

/**
 * Kiến trúc LLM Facade (Trái tim của hệ thống AI)
 * Orchestrator điều phối: Memory -> RAG -> Persona -> Gateway -> Function Caller -> Memory
 */
export const aiFacade = {
  handleChat: async ({ prompt, sessionId = 'default-session', persona = 'CUSTOMER', context = {} }) => {
    try {
      const userMessage = prompt;
      const question = prompt;
      const role = persona;
      
      // Lấy entityId dựa theo role để giới hạn ngữ cảnh tìm kiếm (RAG)
      let entityId = null;
      if (role === 'owner' || role === 'Quản lý thương hiệu' || role === 'BRAND_OWNER') {
        entityId = context.brandId;
      } else if (role === 'manager' || role === 'Quản lý nhà hàng' || role === 'Nhân viên') {
        entityId = context.restaurantId;
      }

      // 1. MEMORY PHASE: Lấy lịch sử trò chuyện
      const chatHistory = AIMemoryService.getHistory(sessionId, 6); // Dùng số chẵn để bảo toàn cặp User-Model

      // 2. RAG PHASE: Trích xuất tài liệu nội bộ
      const retrievedContext = await RAGEngine.retrieveContext(role, question, entityId);

      // 3. PERSONA PHASE: Lấy cấu hình nhân cách
      const personaConfig = await getPersonaConfig(role);
      let systemPrompt = personaConfig.buildPrompt(retrievedContext);
      
      // Bơm thời gian thực tế vào Prompt để AI nhận thức được thời gian
      const currentTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      systemPrompt += `\n\n[SYSTEM CONTEXT]\nThời gian hiện tại của hệ thống là: ${currentTime}. Hãy sử dụng thời gian này làm mốc khi người dùng nhắc đến "hôm nay", "ngày mai", v.v.`;

      const tools = personaConfig.declaredTools && personaConfig.declaredTools.length > 0 

        ? [{ functionDeclarations: personaConfig.declaredTools }] 
        : null;

      // 4. GATEWAY PHASE: Gọi định tuyến Failover
      const { aiResponse, provider } = await routeAiRequest(
        context.brandId || null, // Phải truyền brandId cho Router để lấy Key, không được truyền restaurantId
        systemPrompt,
        userMessage,
        tools,
        chatHistory
      );

      let finalResponseText = aiResponse.text();
      const functionCalls = aiResponse.functionCalls;

      // 5. ACTION PHASE: Thực thi Function Calling
      if (functionCalls && functionCalls.length > 0) {
        // TRUYỀN context VÀO EXECUTOR
        const apiResponses = await FunctionCaller.execute(functionCalls, personaConfig.executorMap, context);
        
        if (apiResponses.length > 0) {
          // Gửi kết quả DB lại cho Provider
          const toolResult = await provider.sendToolResponse(aiResponse.chatSession, apiResponses);
          finalResponseText = toolResult.text();
        }
      }

      // 6. SAVE MEMORY PHASE: Lưu lại câu thoại
      AIMemoryService.saveMessage(sessionId, "user", userMessage);
      AIMemoryService.saveMessage(sessionId, "model", finalResponseText);

      return finalResponseText;

    } catch (error) {
      console.error("[LLM Facade Error]:", error);
      throw new Error(error.message || "Hệ thống AI hiện đang bận do quá tải. Vui lòng đợi 1 phút rồi thử lại nhé!");
    }
  }
};
