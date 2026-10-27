import * as deleteRepo from "../repositories/web_author.delete.repo.js";
import * as getRepo from "../repositories/web_author.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteWebAuthor = async (id) => {
  const existing = await getRepo.findAuthorById(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy thông tin tác giả");
  }

  return await deleteRepo.deleteWebAuthor(id);
};
