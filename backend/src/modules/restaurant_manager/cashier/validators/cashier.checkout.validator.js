import { demoValidator } from "../../../../core/utils/validator.js";
import { z } from "zod";

const checkoutSchema = z.object({
  body: z.object({
    orderId: demoValidator.chuoi("ID Đơn hàng"),
    payments: z.array(z.object({
      systemPaymentMethodId: demoValidator.chuoiKhongBatBuoc("ID Phương thức thanh toán"),
      amount: demoValidator.double("Số tiền thanh toán", 0)
    })).min(1, "Vui lòng chọn ít nhất 1 phương thức thanh toán"),
    surchargeAmount: demoValidator.double("Phụ thu", 0).optional(),
    tipAmount: demoValidator.double("Tiền Tip", 0).optional(),
    discountReason: demoValidator.chuoiKhongBatBuoc("Lý do giảm giá"),
    loyaltyPointsUsed: demoValidator.int("Điểm thành viên sử dụng", 0).optional()
  })
});

export { checkoutSchema };
