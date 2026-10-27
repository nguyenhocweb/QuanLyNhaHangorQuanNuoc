import { Router } from "express";
import asyncHandler from "../../../core/utils/asyncHandler.js";
import { generateTablePairingCode } from "./pairing/controllers/pairing.generate.controller.js";

const route = Router({ mergeParams: true });

// POS Quản lý nhà hàng sinh mã PIN 6 số cho bàn
route.post("/pairing/generate", asyncHandler(generateTablePairingCode));

export default route;
