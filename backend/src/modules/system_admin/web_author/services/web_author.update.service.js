import * as updateRepo from "../repositories/web_author.update.repo.js";
import * as getRepo from "../repositories/web_author.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateWebAuthor = async (id, data) => {
  const existing = await getRepo.findAuthorById(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy thông tin tác giả");
  }

  return await updateRepo.updateWebAuthor(id, data);
};
