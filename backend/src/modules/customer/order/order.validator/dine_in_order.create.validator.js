import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createDineInOrderValidator = z.object({
    body: z.object({
        reservationId: demoValidator.chuoi("Mã đặt bàn"),
        items: z.array(
            z.object({
                menuItemId: demoValidator.chuoi("Món ăn"),
                name: demoValidator.chuoi("Tên món"),
                quantity: demoValidator.int("Số lượng", 1, 99),
                unitPrice: demoValidator.double("Đơn giá", 0),
                note: demoValidator.chuoiKhongBatBuoc("Ghi chú")
            })
        ).min(1, "Vui lòng chọn ít nhất 1 món để gọi")
    })
});
