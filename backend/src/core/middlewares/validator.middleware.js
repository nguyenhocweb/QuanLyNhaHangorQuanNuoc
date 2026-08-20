// src/middlewares/validator.middleware.js
import  asyncHandler  from '../utils/asyncHandler.js';
import { BadRequestError } from '../constants/error/index.js';
import { ZodError } from "zod";

export const validate = (schema) => asyncHandler(async (req, res, next) => {
  try {
    // Zod parse: Nếu dữ liệu sai nó sẽ throw error ngay lập tức
    // parse vs parseAsync: Dùng parse cho đồng bộ (nhanh hơn)
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (error) {
    // --- XỬ LÝ LỖI ZOD CHO ĐẸP ---
    // Zod trả về mảng lỗi rất dài, ta cần gom lại thành 1 chuỗi dễ đọc
    // Ví dụ: "Email không hợp lệ, Mật khẩu quá ngắn"

    if (error instanceof ZodError) {
      const message = error.issues
        .map(issue => ` ${issue.message}`)
        ;

      return next(new BadRequestError(message[0]));
    }

    next(error); // lỗi khác thì ném tiếp
  }
}
);