import { activateApiKeyRepo } from "../repositories/api_key.activate.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const activateApiKeyService = async (id) => {
  if (!id) throw new BadRequestError("Thiếu ID của API Key");
  return await activateApiKeyRepo(id);
};
