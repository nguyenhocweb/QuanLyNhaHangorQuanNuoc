import express from 'express';
import { validate } from '../../../core/middlewares/validator.middleware.js';
import asyncHandler from '../../../core/utils/asyncHandler.js';
import { authenticateToken } from '../../../core/middlewares/authenticateToken.js';
import { authorizeRole } from '../../../core/middlewares/authorizeRole.middleware.js';

// Controllers
import createController from './controllers/promotion.create.controller.js';
import getController from './controllers/promotion.get.controller.js';
import updateController from './controllers/promotion.update.controller.js';
import deleteController from './controllers/promotion.delete.controller.js';
import toggleController from './controllers/promotion.toggle.controller.js';

// Validators
import { createPromotionValidator } from './validators/promotion.create.validator.js';
import { updatePromotionValidator } from './validators/promotion.update.validator.js';

const route = express.Router({ mergeParams: true });

// Tất cả endpoints đều cần xác thực và quyền RESTAURANT
route.use(authenticateToken);
route.use(authorizeRole("Quản lý nhà hàng"));

// Lấy danh sách khuyến mãi
route.get("/", asyncHandler(getController.getPromotions));

// Lấy chi tiết khuyến mãi
route.get("/:id", asyncHandler(getController.getPromotionById));

// Tạo khuyến mãi mới
route.post("/", validate(createPromotionValidator), asyncHandler(createController.createPromotion));

// Cập nhật khuyến mãi
route.put("/:id", validate(updatePromotionValidator), asyncHandler(updateController.updatePromotion));

// Đổi trạng thái (Bật/Tắt)
route.patch("/:id/toggle", asyncHandler(toggleController.togglePromotion));

// Xóa khuyến mãi
route.delete("/:id", asyncHandler(deleteController.deletePromotion));

export default route;
