import { NotFoundError } from "../../../../core/constants/error/index.js";
import reviewReplyRepo from "../repositories/review.reply.repo.js";
import reviewStatusRepo from "../repositories/review.status.repo.js";

const updateReviewStatusService = async (id, status, restaurantId) => {
    const review = await reviewReplyRepo.findReviewById(id);
    if (!review || review.restaurantId !== restaurantId) {
        throw new NotFoundError("Không tìm thấy đánh giá");
    }
    return reviewStatusRepo.updateStatus(id, status);
};

export default { updateReviewStatusService };