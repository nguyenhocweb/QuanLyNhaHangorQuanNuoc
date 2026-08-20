import { getApiKeysRepo } from "../repositories/api_key.get.repo.js";

export const getApiKeysService = async (query) => {
  return await getApiKeysRepo(query);
};
