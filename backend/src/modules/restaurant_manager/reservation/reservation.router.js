import { Router } from "express";
import { authenticateToken } from "../../../core/middlewares/authenticateToken.js";
import { authorizeRole } from "../../../core/middlewares/authorizeRole.middleware.js";
import { authorizePermission } from "../../../core/middlewares/authorizePermission.middleware.js";
import { validate } from "../../../core/middlewares/validator.middleware.js";

import { reservationCreateValidator } from "./validators/reservation.create.validator.js";
import * as updateValidators from "./validators/reservation.update.validator.js";

import { getReservations, getReservationById } from "./controllers/reservation.get.controller.js";
import { createReservation } from "./controllers/reservation.create.controller.js";
import { updateReservation } from "./controllers/reservation.update.controller.js";
import { updateReservationStatus } from "./controllers/reservation.status.controller.js";
import { assignTable, unassignTable } from "./controllers/reservation.assign.controller.js";

const route = Router();

// Middleware xác thực (tất cả các route trong nhà hàng đều cần đăng nhập)
route.use(authenticateToken);
route.use(authorizeRole('Admin', 'Quản lý nhà hàng', 'Chủ thương hiệu', 'Nhân viên')); // Admin, Quản lý nhà hàng, Chủ thương hiệu hoặc Nhân viên đều được thao tác

// GET /
route.get("/:restaurantId", authorizePermission('VIEW_RESERVATION'), getReservations);

// GET /:id
route.get("/:restaurantId/:id", authorizePermission('VIEW_RESERVATION'), getReservationById);

// POST /
route.post("/:restaurantId", authorizePermission('CREATE_RESERVATION'), validate(reservationCreateValidator), createReservation);

// PUT /:id
route.put("/:restaurantId/:id", authorizePermission('UPDATE_RESERVATION'), validate(updateValidators.reservationUpdateValidator), updateReservation);

// PATCH /:id/status
route.patch("/:restaurantId/:id/status", authorizePermission('UPDATE_RESERVATION'), validate(updateValidators.reservationStatusValidator), updateReservationStatus);

// POST /:id/assign
route.post("/:restaurantId/:id/assign", authorizePermission('ASSIGN_RESERVATION_TABLE'), validate(updateValidators.reservationAssignValidator), assignTable);

// DELETE /:id/assign/:tableId
route.delete("/:restaurantId/:id/assign/:tableId", authorizePermission('ASSIGN_RESERVATION_TABLE'), unassignTable);

export default route;
