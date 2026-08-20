import { deleteAiModelRepo } from "../repositories/ai_model.delete.repo.js";

export const deleteAiModelService = async (id) => {
  return await deleteAiModelRepo(id);
};