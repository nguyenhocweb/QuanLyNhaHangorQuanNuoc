import { z } from "zod";
import { demoValidator } from "../../../../core/utils/validator.js";

export default z.object({
    body: z.object({
        user_name: demoValidator.chuoi("Tên đăng nhập"),
        name: z.string().trim().optional(),
        email: demoValidator.email(),
        password: demoValidator.password("Mật khẩu"),
        confirmPassword: demoValidator.chuoi("Xác nhận mật khẩu"),
        date_of_birth: z.preprocess(
            (val) => (val === "" || val === null || val === undefined ? undefined : val),
            demoValidator.date_sinh("Ngày sinh", 10, 100).optional()
        ),
        gender: z.preprocess(
            (val) => (val === "" || val === null || val === undefined ? undefined : val),
            demoValidator.gender().optional()
        ),
    }).refine((data) => data.confirmPassword === data.password, {
        message: "Xác nhận mật khẩu không khớp",
        path: ["confirmPassword"]
    })
});