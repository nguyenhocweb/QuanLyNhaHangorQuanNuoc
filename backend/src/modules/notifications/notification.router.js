import { Router } from "express";
import asyncHandler from "../../core/utils/asyncHandler.js";
import { getNotificationController } from "./controllers/notification.get.controller.js";
import { updateNotificationController } from "./controllers/notification.update.controller.js";
import { deleteNotificationController } from "./controllers/notification.delete.controller.js";
import { pushNotificationController } from "./controllers/notification.push.controller.js";
import { validate } from "../../core/middlewares/validator.middleware.js";
import { pushNotificationValidator } from "./validators/notification.push.validator.js";

const route = Router({ mergeParams: true });

// --- CÁC ROUTE CỦA THÔNG BÁO ---

// 1. Lấy danh sách thông báo theo workspaceType (CUSTOMER, RESTAURANT, BRAND)
route.get("/", asyncHandler(getNotificationController.getNotifications));

// 1.5. Lấy số lượng thông báo chưa đọc (Dùng chung cho cái chuông)
route.get("/unread-count", asyncHandler(getNotificationController.getUnreadCount));

// 2. Đánh dấu tất cả là đã đọc
route.put("/read-all", asyncHandler(updateNotificationController.markAllAsRead));

// 3. Đánh dấu 1 thông báo cụ thể là đã đọc
route.put("/:id/read", asyncHandler(updateNotificationController.markAsRead));

// 4. Xóa 1 thông báo (Soft Delete)
route.delete("/:id", asyncHandler(deleteNotificationController.deleteNotification));

// 5. System Admin đẩy thông báo
route.post("/push", validate(pushNotificationValidator), asyncHandler(pushNotificationController.push));

export default route;
