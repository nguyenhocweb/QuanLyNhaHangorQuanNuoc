import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
// 2. KHỞI TẠO SINGLETON: Đây chính là biến genAI mà bạn đang import ở các file khác
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. CẤU HÌNH CÁC MODEL SẴN SÀNG SỬ DỤNG
const defaultModelFlash = {
    // Nếu trong .env không có AI_MODEL_FLASH, nó sẽ tự dùng gemini-2.5-flash
    model: process.env.AI_MODEL_FLASH ,
    generationConfig: {
        temperature: parseFloat(process.env.AI_TEMPERATURE), 
    }
};

const defaultModelPro = {
    model: process.env.AI_MODEL_PRO ,
    generationConfig: {
        temperature: parseFloat(process.env.AI_TEMPERATURE), 
    }
};

// 4. EXPORT CÁC MODEL CHAT ĐỂ DÙNG TRONG LLM SERVICE
export const aiFlash = genAI.getGenerativeModel(defaultModelFlash);
export const aiPro = genAI.getGenerativeModel(defaultModelPro);


