import { NotFoundError } from "../../../../core/constants/error/index.js";
import reviewReplyRepo from "../repositories/review.reply.repo.js";

const replyReviewService = async (id, staff_response, restaurantId) => {
    const review = await reviewReplyRepo.findReviewById(id);
    if (!review || review.restaurantId !== restaurantId) {
        throw new NotFoundError("Không tìm thấy đánh giá");
    }
    return reviewReplyRepo.updateReply(id, staff_response);
};

export default { replyReviewService };