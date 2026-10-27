import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { verifyTablePairingCode } from "./pairing/controllers/pairing.verify.controller.js";
import { getTableKioskSession } from "./session/controllers/session.get.controller.js";
import { placeTableKioskOrder } from "./order/controllers/order.place.controller.js";
import { cancelTableKioskOrderItem } from "./order/controllers/order.cancel_item.controller.js";
import { applyTableKioskPromotion, removeTableKioskPromotion } from "./order/controllers/order.apply_promotion.controller.js";
import { createServiceCall } from "./service_call/controllers/service_call.create.controller.js";

const route = Router();

// 1. Ghép nối Tablet qua mã PIN 6 số
route.post("/pairing/verify", asyncHandler(verifyTablePairingCode));

// 2. Lấy thông tin phiên bàn hiện tại
route.get("/session", asyncHandler(getTableKioskSession));

// 3. Đặt món từ Tablet tại bàn
route.post("/order", asyncHandler(placeTableKioskOrder));

// 4. Hủy món ăn (chỉ khi món đang ở trạng thái QUEUED - chưa nấu)
route.post("/order/cancel-item", asyncHandler(cancelTableKioskOrderItem));

// 5. Áp dụng mã giảm giá / Voucher khuyến mãi
route.post("/order/apply-promotion", asyncHandler(applyTableKioskPromotion));

// 6. Gỡ mã giảm giá
route.post("/order/remove-promotion", asyncHandler(removeTableKioskPromotion));

// 7. Gửi yêu cầu gọi phục vụ / xin nước / gọi tính tiền
route.post("/service-call", asyncHandler(createServiceCall));

export default route;
