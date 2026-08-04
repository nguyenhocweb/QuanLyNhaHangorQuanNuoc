import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createOrderValidator = z.object({
  body: z.object({
    restaurantId: demoValidator.chuoi("ID Nhà hàng"),
    tableId: demoValidator.chuoiKhongBatBuoc("ID Bàn"),
    isTakeaway: z.boolean().optional(),
    items: demoValidator.array(
      "Danh sách món",
      z.object({
        menuItemId: demoValidator.chuoi("ID Món ăn"),
        quantity: demoValidator.int("Số lượng").min(1, "Số lượng phải lớn hơn 0"),
        note: demoValidator.chuoiKhongBatBuoc("Ghi chú"),
      })
    ).min(1, "Đơn hàng phải có ít nhất 1 món"),
  }),
});
