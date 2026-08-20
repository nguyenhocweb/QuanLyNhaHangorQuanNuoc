import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

export const approveStockCountValidator = {
  body: z.object({
    reason: demoValidator.chuoiKhongBatBuoc("Lý do"),
  }),
  params: z.object({
    id: demoValidator.chuoi("ID Phiếu Kiểm"),
  }),
};
