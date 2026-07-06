import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { chatBoxAiLLMService } from "../../../shared/llm/llm.service.js";
export const ChatBoxAi = asyncHandler(
    async (req, res) => {
        const {message,question} = req.body;

        if (!message) {
            return res.status(400).json({ error: "Vui lòng cung cấp tin nhắn." });
        }
        const textMessage = JSON.stringify(message);
        // Gọi service LLM
        const aiReply = await chatBoxAiLLMService(textMessage,question);

        // Trả kết quả về cho Frontend
        return res.status(200).json(aiReply);

    }
)