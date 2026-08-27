import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { aiFacade } from "../../../shared/llm/llm.facade.js";

export const ChatBoxAi = asyncHandler(
    async (req, res) => {
        const {message, question, brandId, sessionId} = req.body;
        // Lấy role từ user đã đăng nhập, nếu là khách vãng lai thì mặc định là CUSTOMER
        const role = req.user?.role || 'CUSTOMER';
        // Generate a random session ID if not provided by Frontend
        const currentSessionId = sessionId || `session_${req.ip}_${Date.now()}`;

        if (!message) {
            return res.status(400).json({ error: "Vui lòng cung cấp tin nhắn." });
        }
        const textMessage = typeof message === 'string' ? message : JSON.stringify(message);
        // Gọi service LLM Facade
        const aiReply = await aiFacade.handleChat({
            prompt: textMessage,
            sessionId: currentSessionId,
            persona: role,
            context: { brandId }
        });

        // Trả kết quả về cho Frontend
        return res.status(200).json(aiReply);

    }
)