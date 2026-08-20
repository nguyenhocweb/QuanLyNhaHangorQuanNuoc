import { getActiveAiChatboxesService } from "../services/ai_chatbox.get.service.js";

export const getActiveAiChatboxesController = async (req, res) => {
  const chatboxes = await getActiveAiChatboxesService();
  return res.status(200).json({
    message: "Lấy danh sách Chatbox thành công",
    metadata: chatboxes
  });
};
