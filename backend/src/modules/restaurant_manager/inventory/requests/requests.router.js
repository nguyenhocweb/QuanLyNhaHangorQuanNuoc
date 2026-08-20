import express from 'express';
import { validate } from '../../../../core/middlewares/validator.middleware.js';
import { asyncHandler } from '../../../../core/utils/asyncHandler.js';
import { authorizeRole } from '../../../../core/middlewares/authorizeRole.middleware.js';

import { createRequestValidator } from './validators/request.create.validator.js';
import { createPurchaseRequest } from './controllers/request.create.controller.js';
import { getPurchaseRequests } from './controllers/request.get.controller.js';

const router = express.Router();

router.use(authorizeRole("Quản lý nhà hàng", "Chủ thương hiệu"));

router.get('/', asyncHandler(getPurchaseRequests));
router.post('/', validate(createRequestValidator), asyncHandler(createPurchaseRequest));

export default router;
