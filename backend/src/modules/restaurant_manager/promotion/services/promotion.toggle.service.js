import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getPromotionByIdRepo } from "../repositories/promotion.get.repo.js";
import { updatePromotionRepo } from "../repositories/promotion.update.repo.js";
import { PromotionStatus } from "../../../../databases/prisma/generated/prisma/client.js";

export const togglePromotionService = async (id) => {
    const existingPromotion = await getPromotionByIdRepo(id);
    if (!existingPromotion) {
        throw new NotFoundError("Không tìm thấy khuyến mãi");
    }

    // Nếu đang ACTIVE -> PAUSED, nếu đang PAUSED/DRAFT -> ACTIVE
    const newStatus = existingPromotion.status === PromotionStatus.ACTIVE 
        ? PromotionStatus.PAUSED 
        : PromotionStatus.ACTIVE;

    const updatedPromotion = await updatePromotionRepo(id, { status: newStatus });

    return updatedPromotion;
};
