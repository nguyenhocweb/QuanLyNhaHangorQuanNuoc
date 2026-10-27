import asyncHandler from "../../../../core/utils/asyncHandler.js";
import { registerService } from "../service/register.service.js";

export const registerController = asyncHandler(async (req, res) => {
    const { user_name, name, email, password, date_of_birth, gender } = req.body;
    const user = await registerService({
        user_name,
        name,
        email,
        password,
        date_of_birth,
        gender
    });

    return res.status(201).json({
        status: "success",
        code: 201,
        message: "Đăng ký tài khoản thành công!",
        metadata: user
    });
});
