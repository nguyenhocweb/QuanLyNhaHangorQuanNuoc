import { updateAiModelRepo } from "../repositories/ai_model.update.repo.js";

export const updateAiModelService = async (id, payload) => {
  return await updateAiModelRepo(id, payload);
};