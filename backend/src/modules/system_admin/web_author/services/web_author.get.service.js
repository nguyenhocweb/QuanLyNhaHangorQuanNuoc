import * as getRepo from "../repositories/web_author.get.repo.js";

export const getAdminAuthors = async () => {
  return await getRepo.getAdminAuthors();
};

export const getAuthorById = async (id) => {
  return await getRepo.findAuthorById(id);
};
