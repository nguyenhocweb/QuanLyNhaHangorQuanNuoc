import { getActiveAiChatboxesRepo } from "../repositories/ai_chatbox.get.repo.js";

export const getActiveAiChatboxesService = async () => {
  return await getActiveAiChatboxesRepo();
};
