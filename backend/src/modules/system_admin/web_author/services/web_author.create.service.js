import * as createRepo from "../repositories/web_author.create.repo.js";

export const createWebAuthor = async (data) => {
  return await createRepo.createWebAuthor(data);
};
