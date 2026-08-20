import { createAiModelRepo } from "../repositories/ai_model.create.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const createAiModelService = async (payload) => {
  return await createAiModelRepo(payload);
};