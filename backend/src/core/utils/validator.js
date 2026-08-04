import { BadRequestError } from "../constants/error/index.js";
import { Gender, AccountStatus } from "../../databases/prisma/generated/prisma/client.js";
import { gender_to_db } from "../../config/locales.js";
import { z, ZodError } from "zod"

const today = new Date();

const minDate = (min) => new Date(
    today.getFullYear() - min,
    today.getMonth(),
    today.getDate()
);

const maxDate = (max) => new Date(
    today.getFullYear() - max,
    today.getMonth(),
    today.getDate()
);
const MS_PER_DAY = 24 * 60 * 60 * 1000;


export const demoValidator = {
    chuoi: (name) => z.string({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là chuỗi`
    }).trim().min(1, `${name} không để trống`),
    chuoiKhongBatBuoc: (name) => z.string({
        invalid_type_error: `${name} phải là chuỗi`
    }).trim().optional(),
    soDienThoai: () => z.string({
        required_error: "Số điện thoại là bắt buộc",
        invalid_type_error: "Số điện thoại phải là chuỗi"
    })
        .trim()
        .min(1, "Số điện thoại không được để trống")
        .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
    password: (name) => z.string({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là chuỗi`
    })
        .trim()
        .min(6, "vui lòng nhập ít nhất 6 ký tự")
        .max(20, "vui lòng nhập không quá 20 ký tự")
        .regex(/[A-Z]/, `${name} phải có ít nhất một chữ cái viết hoa`)
        .regex(/[a-z]/, `${name} phải có ít nhất một chữ cái viết thường`)
        .regex(/\d/, `${name} phải có ít nhất một chữ số`)
        .regex(/[!@$%.]/, `${name} phải có ít nhất một ký tự đặc biệt !@$%.`)
    ,
    int: (name, min, max) => z.coerce.number({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là số`
    })
        .int(`${name} phải là số nguyên`)
        .refine(val => (min !== undefined ? val >= min : true), { message: `${min} <= ${name} <= ${max}` })
        .refine(val => (max !== undefined ? val <= max : true), { message: ` ${min} <= ${name} <= ${max}` }),
    double: (name, min, max) => z.coerce.number({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là số`
    })
        .refine(val => isFinite(val), { message: `${name} phải là số hữu hạn` })
        .refine(val => (min !== undefined ? val >= min : true), { message: ` ${name} phải >= ${min} ` })
        .refine(val => (max !== undefined ? val <= max : true), { message: `  ${name} phải <= ${max}` }),
    email: (name = "Email") => z.string({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là số`
    }).trim().email(`${name} không hợp lệ`),
    gender: () => z.preprocess(
        // hàm sử lý chuyển đổi có giấu thành không dấu để phù hợp với db
        (val) => {
            if (typeof val === "string") {
                // Chuẩn hóa: Trim khoảng trắng và chuyển về chữ thường để so sánh
                return gender_to_db[val] || val
            }
        },
        // 2. Sau khi preprocess xong, dữ liệu (ví dụ "Nu") sẽ được đẩy vào đây để check Enum
        z.nativeEnum(Gender, {
            errorMap: (issue, ctx) => {
                return {
                    // Message lỗi khi client gửi giá trị lạ hoắc (vd: "Gay", "Lesbian"...)
                    message: "Giới tính không hợp lệ (Vui lòng chọn: Nam, Nữ, Khác)"
                }
            }
        })
    ),
    AccountStatus: () => z.nativeEnum(AccountStatus, {
        errorMap: (issue, ctx) => {
            return {
                message: "trạng thái tài khoản không phù hợp"
            }
        }
    }),
    boolean: (name) => z.coerce.boolean({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là true hoặc false`
    }),
    date_sinh: (name, min, max) => z.coerce.date({
        required_error: `${name} là bắt buộc`,
        invalid_type_error: `${name} phải là số`
    })
        .refine(date => {
            return date <= minDate(min) && date >= maxDate(max)
        }, {
            message: `tuổi phải từ ${min} -> ${max}`
        }
        ),
    event_date: (name, minDays, maxDays) =>
        z.coerce.date({
            required_error: `${name} là bắt buộc`,
            invalid_type_error: `${name} không hợp lệ`
        }).refine(date => {
            // chuẩn hóa về 00:00 để tránh lệch timezone
            today.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);

            const diffDays = Math.floor(
                (date.getTime() - today.getTime()) / MS_PER_DAY
            );

            if (minDays !== undefined && diffDays < minDays) return false;
            if (maxDays !== undefined && diffDays > maxDays) return false;

            return true;
        }, {
            message:
                minDays !== undefined && maxDays !== undefined
                    ? `${name} phải cách hôm nay từ ${minDays} đến ${maxDays} ngày`
                    : minDays !== undefined
                        ? `${name} phải cách hôm nay ít nhất ${minDays} ngày`
                        : `${name} không được vượt quá ${maxDays} ngày`
        }),
    enum: (name, values) => z.enum(values, {
        errorMap: (issue, ctx) => {
            return {
                message: `${name} phải là một trong các giá trị sau: ${values.join(", ")}`
            }
        }
    }),
    file: (name, options) => {
        const MAX_SIZE_BYTES = (options?.maxSizeMB || 5) * 1024 * 1024;

        return z.any()
            // KIỂM TRA QUAN TRỌNG: Node.js nhận file là một Object từ Multer
            .refine((file) => file && typeof file === 'object', `Vui lòng chọn ${name}`)
            .refine((file) => file?.size <= MAX_SIZE_BYTES, `${name} vượt quá ${options?.maxSizeMB || 5}MB`)
            .refine((file) => {
                if (!options?.acceptedTypes) return true;
                return options.acceptedTypes.includes(file?.mimetype);
            }, `Định dạng ${name} không hợp lệ`);
    },
    array: (name, itemSchema, minLength, maxLength) => {
        let arraySchema = z.array(itemSchema, {
            required_error: `${name} là bắt buộc`,
            invalid_type_error: `${name} phải là một mảng`
        });

        if (minLength !== undefined) {
            arraySchema = arraySchema.min(minLength, `${name} phải có ít nhất ${minLength} phần tử`);
        }
        if (maxLength !== undefined) {
            arraySchema = arraySchema.max(maxLength, `${name} không được vượt quá ${maxLength} phần tử`);
        }

        return arraySchema;
    },


}
