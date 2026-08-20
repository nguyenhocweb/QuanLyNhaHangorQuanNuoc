import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const updateTagValidator = z.object({
  body: z.object({
    name: demoValidator.chuoiKhongBatBuoc("Tên thẻ"),
    slug: demoValidator.chuoiKhongBatBuoc("Slug"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    textColor: demoValidator.chuoiKhongBatBuoc("Màu chữ"),
    bgColor: demoValidator.chuoiKhongBatBuoc("Màu nền"),
  })
});
