import { getAiModelsRepo, getActiveAiModelsRepo } from "../repositories/ai_model.get.repo.js";

export const getAiModelsService = async (query) => {
  return await getAiModelsRepo(query);
};

export const getActiveAiModelsService = async (chatboxId) => {
  return await getActiveAiModelsRepo(chatboxId);
};