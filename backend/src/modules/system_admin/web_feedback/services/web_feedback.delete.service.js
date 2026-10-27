import * as deleteRepo from "../repositories/web_feedback.delete.repo.js";
import * as getRepo from "../repositories/web_feedback.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const deleteFeedback = async (id) => {
  const existing = await getRepo.findFeedbackById(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy nhận xét đánh giá");
  }

  return await deleteRepo.deleteFeedback(id);
};
