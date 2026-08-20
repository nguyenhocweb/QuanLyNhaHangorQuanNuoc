import { revokeApiKeyRepo } from "../repositories/api_key.revoke.repo.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

export const revokeApiKeyService = async (id) => {
  if (!id) throw new BadRequestError("Thiếu ID của API Key");
  return await revokeApiKeyRepo(id);
};
