import { prisma } from "../../../../databases/init.mongodb.js";

export const updatePromotionRepo = async (id, data) => {
    const { menuItemIds, ...promotionData } = data;
    const updateData = { ...promotionData };
    
    if (menuItemIds !== undefined) {
        updateData.promotionMenuItems = {
            deleteMany: {}, // Xóa hết cũ
        };
        if (menuItemIds.length > 0) {
            updateData.promotionMenuItems.create = menuItemIds.map(itemId => ({ menuItemId: itemId }));
        }
    }

    return await prisma.promotion.update({
        where: { id },
        data: updateData
    });
};
