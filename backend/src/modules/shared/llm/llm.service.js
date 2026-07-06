// src/modules/ai/service/llm.service.js

import { aiFlash, aiPro } from "../../../config/ai.config.js";
import buildSystemPrompt from "./prompt/chat.prompt.js";

import { executeCountBrand, executeGetBrands, executeGetBrand } from "./tools/brand.tools/executeBrand.js"; // File chứa logic tool của bạn
import { executeCountRestaurant, executeGetRestaurant, executeGetRestaurants } from "./tools/restaurant.tools/executeRestaurant.js";
import { executeCountMenuItem, executeGetMenuItem, executeGetMenuItems } from "./tools/dish/executeDish.js";
// Giả định bạn đã có hàm tạo embedding từ text
import { tools } from "./tools/index.js";

// Map tên tool của AI với hàm gọi Database tương ứng
const toolExecutors = {
    countBrand: executeCountBrand,
    countRestaurant: executeCountRestaurant,
    countMenuItem: executeCountMenuItem,
    getBrand: executeGetBrand,
    getBrands: executeGetBrands,
    getRestaurant: executeGetRestaurant,
    getRestaurants: executeGetRestaurants,
    getMenuItem: executeGetMenuItem,
    getMenuItems: executeGetMenuItems,
    
};

export const chatBoxAiLLMService = async (userMessage, question, useProModel = false) => {
    const MAX_ATTEMPTS = 3; // Tổng số lần thử (1 lần gọi đầu + 2 lần retry)
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {



            //cso thể thêm vectorDB nếu muốn 
            // Bước 3: Khởi tạo Model, System Prompt và Chat Session
            const model = useProModel ? aiPro : aiFlash;
            const systemPrompt = buildSystemPrompt(
                [
                    ` cấu trúc tin nhắn của bạn và khách: ${userMessage}`,
                    `câu hỏi chính của khách mà bạn cần trả lời ${question}`
                ].join("\n\n")
            );

            const chatSession = model.startChat({
                // SỬA LỖI SYSTEM INSTRUCTION: Bọc vào object Content chuẩn của Gemini
                systemInstruction: {
                    role: "system",
                    parts: [{ text: systemPrompt }]
                },
                // Đưa mảng foleatTools chuẩn vào
                tools: tools
            });



            // Bước 4: Gửi tin nhắn lần 1 cho AI
            let result = await chatSession.sendMessage(userMessage);

            let response = result.response;
            console.log(response);

            // Bước 5: Kiểm tra xem AI có yêu cầu gọi Tool (Function Calling) không
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                // 1. Map và gọi hàm song song
                const promises = functionCalls.map(async (call) => {
                    const executor = toolExecutors[call.name]; // Tra từ điển

                    if (!executor) {
                        console.warn(`Tool ${call.name} chưa được khai báo!`);
                        return null;
                    }

                    // Gọi hàm động bằng executor
                    const dbResult = await executor(call.args);
                    return { functionResponse: { name: call.name, response: dbResult } };
                });

                // 2. Chạy Promise.all và .filter(Boolean) để loại bỏ các kết quả null/undefined
                const apiResponses = (await Promise.all(promises)).filter(Boolean);

                // 3. Gửi lại cho AI
                if (apiResponses.length > 0) {
                    let result = await chatSession.sendMessage(apiResponses);
                    response = result.response;
                }
            }

            // Bước cuối: Trả về câu trả lời dạng văn bản (Text) cho Client
            return response.text();

        } catch (error) {

            // Kiểm tra xem lỗi có phải là 503 không (kiểm tra status code hoặc nội dung message)
            const is503 = error?.status === 503 || error?.message?.includes('503');

            if (is503) {
                if (attempt < MAX_ATTEMPTS) {
                    // Tính toán thời gian chờ (Lần 1 đợi 2s, Lần 2 đợi 4s...)
                    const delayMs = attempt * 2000;
                    console.warn(`[Cảnh báo] Lỗi 503 từ API. Đang thử lại lần ${attempt + 1}/${MAX_ATTEMPTS} sau ${delayMs}ms...`);

                    // Dừng thực thi code trong khoảng thời gian delayMs trước khi lặp lại
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue; // Bỏ qua đoạn dưới, quay lại đầu vòng lặp `for`
                } else {
                    console.error(`[Thất bại] Đã thử ${MAX_ATTEMPTS} lần nhưng vẫn gặp lỗi 503.`);
                }
            }
            console.error("Lỗi trong chatBoxAiLLMService:", error);
            throw new Error("Hệ thống AI hiện đang bận do quá tải. Vui lòng đợi 1 phút rồi thử lại nhé!.");
        }
    };
}
