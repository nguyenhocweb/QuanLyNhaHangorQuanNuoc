import * as updateRepo from "../repositories/web_feedback.update.repo.js";
import * as getRepo from "../repositories/web_feedback.get.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateFeedback = async (id, data, adminId) => {
  const existing = await getRepo.findFeedbackById(id);
  if (!existing) {
    throw new NotFoundError("Không tìm thấy nhận xét đánh giá");
  }

  const updateData = {
    ...data,
    ...(data.status ? { reviewedBy: adminId } : {}),
    ...(data.adminReply ? { repliedAt: new Date() } : {})
  };

  return await updateRepo.updateFeedback(id, updateData);
};
