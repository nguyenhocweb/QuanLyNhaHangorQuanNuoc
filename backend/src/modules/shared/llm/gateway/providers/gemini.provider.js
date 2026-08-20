import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider {
  /**
   * Khởi tạo Model và sinh nội dung
   * @param {string} apiKey - Khóa API đã giải mã
   * @param {string} modelName - Tên model (VD: gemini-2.5-flash)
   * @param {string} systemPrompt - Câu lệnh hệ thống
   * @param {string} userMessage - Tin nhắn của người dùng
   * @param {Array|null} tools - Danh sách các Tool Functions (Tùy chọn)
   * @param {Array} chatHistory - Lịch sử trò chuyện
   * @returns {Object} { text, functionCalls }
   */
  static async generateContent(apiKey, modelName, systemPrompt, userMessage, tools, chatHistory = []) {
    // 1. Khởi tạo SDK với Key được cấp
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 2. Cấu hình Model
    if (!modelName) {
      throw new Error("Tên Model không được cung cấp cho Gemini Provider.");
    }

    const modelConfig = {
      model: modelName,
      generationConfig: {
        temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"), 
      }
    };
    const model = genAI.getGenerativeModel(modelConfig);

    // 3. Khởi tạo Chat Session với Lịch sử (Memory)
    const chatSession = model.startChat({
      history: chatHistory, // Bơm trí nhớ vào đây
      systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }]
      },
      ...(tools && { tools: tools })
    });

    // 4. Gửi tin nhắn
    const result = await chatSession.sendMessage(userMessage);
    const response = result.response;

    // 5. Chuẩn hóa Output để trả về Router
    return {
      text: response.text.bind(response), // Trả về hàm text() thay vì gọi luôn phòng lỗi
      functionCalls: response.functionCalls ? response.functionCalls() : null,
      chatSession // Trả về session để Router có thể chat tiếp nếu gọi tool thành công
    };
  }

  /**
   * Trả lời kết quả của Tool Function lại cho AI
   */
  static async sendToolResponse(chatSession, apiResponses) {
    const result = await chatSession.sendMessage(apiResponses);
    return {
      text: result.response.text.bind(result.response)
    };
  }
}
