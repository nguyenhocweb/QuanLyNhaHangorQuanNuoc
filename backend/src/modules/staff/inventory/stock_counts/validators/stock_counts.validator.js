import { z } from "zod";
import { demoValidator } from "../../../../../core/utils/validator.js";

export const stockCountValidator = {
  create: {
    body: z.object({
      restaurantId: demoValidator.chuoi("ID Nhà hàng"),
      notes: demoValidator.chuoiKhongBatBuoc("Ghi chú"),
      items: z.array(z.object({
        inventoryItemId: demoValidator.chuoi("ID Sản phẩm"),
        actualQty: z.number().min(0, "Số lượng phải >= 0")
      })).min(1, "Phải có ít nhất 1 mặt hàng")
    })
  },
  submit: {
    params: z.object({
      id: demoValidator.chuoi("ID Phiếu Kiểm")
    })
  }
};
