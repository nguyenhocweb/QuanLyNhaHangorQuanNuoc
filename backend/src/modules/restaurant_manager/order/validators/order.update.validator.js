import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateOrderValidator = z.object({
  body: z.object({
    restaurantId: demoValidator.chuoi("ID Nhà hàng"),
    status: demoValidator.chuoiKhongBatBuoc("Trạng thái đơn hàng"),
    systemPaymentMethodId: demoValidator.chuoiKhongBatBuoc("ID Phương thức thanh toán"),
    itemsToAdd: demoValidator.array(
      "Danh sách món thêm",
      z.object({
        menuItemId: demoValidator.chuoi("ID Món ăn"),
        quantity: demoValidator.int("Số lượng").min(1, "Số lượng phải lớn hơn 0"),
        note: demoValidator.chuoiKhongBatBuoc("Ghi chú"),
      })
    ).optional(),
  }),
});
