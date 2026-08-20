import { pushNotificationService } from "../services/notification.push.service.js";
import { BadRequestError } from "../../../core/constants/error/index.js";

export const pushNotificationController = {
  push: async (req, res) => {
    const { targetType, targetIds, isAllOfType, title, body, type, referenceId, referenceType } = req.body;

    let result;

    switch (targetType) {
      case "ALL_SYSTEM":
        result = await pushNotificationService.pushToAll({ title, body, type, referenceId, referenceType });
        break;
      case "INDIVIDUAL_USER":
        if (!isAllOfType && (!targetIds || targetIds.length === 0)) throw new BadRequestError("Thiếu targetIds cho INDIVIDUAL_USER");
        result = await pushNotificationService.pushToCustomer({ userIds: targetIds, isAllOfType, title, body, type, referenceId, referenceType });
        break;
      case "RESTAURANT":
        if (!isAllOfType && (!targetIds || targetIds.length === 0)) throw new BadRequestError("Thiếu targetIds cho RESTAURANT");
        result = await pushNotificationService.pushToRestaurant({ restaurantIds: targetIds, isAllOfType, title, body, type, referenceId, referenceType });
        break;
      case "BRAND":
        if (!isAllOfType && (!targetIds || targetIds.length === 0)) throw new BadRequestError("Thiếu targetIds cho BRAND");
        result = await pushNotificationService.pushToBrand({ brandIds: targetIds, isAllOfType, title, body, type, referenceId, referenceType });
        break;
      default:
        throw new BadRequestError("Loại đối tượng không hợp lệ");
    }

    res.status(201).json({
      message: "Đã gửi thông báo thành công",
      metadata: result
    });
  }
};
