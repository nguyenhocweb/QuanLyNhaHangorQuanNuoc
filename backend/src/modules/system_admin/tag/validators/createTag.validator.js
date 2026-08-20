import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export const createTagValidator = z.object({
  body: z.object({
    name: demoValidator.chuoi("Tên thẻ"),
    slug: demoValidator.chuoi("Slug"),
    description: demoValidator.chuoiKhongBatBuoc("Mô tả"),
    textColor: demoValidator.chuoiKhongBatBuoc("Màu chữ"),
    bgColor: demoValidator.chuoiKhongBatBuoc("Màu nền"),
  })
});
