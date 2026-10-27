import * as getRepo from "../repositories/web_author.get.repo.js";

export const getPublicAuthors = async () => {
  return await getRepo.getPublicAuthors();
};
