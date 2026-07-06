import { z } from "zod";
export const validator = {
    string: (name: string, max: number = 255, min?: number) =>
        z.string({ message: `${name} phải là chuổi` })
            .trim()
            .min(min ?? 1, `${name} ${min ? `phải lón hơn ${min} ký tự ` : "không được để trống"}`)
            .max(max, `${name} không được vượt quá ${max} ký tự`),
    email: () =>
        z.string({ message: "Vui lòng nhập Email" })
            .trim()
            .min(1, "Email không được để trống")
            .email("Định dạng email không hợp lệ"),
    phone: () =>
        z.string({ message: "Vui lòng nhập Số điện thoại" })
            .trim()
            .min(1, "Số điện thoại không được để trống")
            .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ "),
    password: (name: string = "Mật khẩu") =>
        z.string({ message: `Vui lòng nhập ${name.toLowerCase()}` })
            .min(8, `${name} phải có ít nhất 8 ký tự`)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
                `phải có hoa,thường,số và ký tự đặc biệt`
            ),
    number: (name: string, min?: number, max?: number) => {
        let schema = z.coerce
            .number({
                message: `Vui lòng nhập ${name.toLowerCase()}`,

            });

        if (min !== undefined) {
            schema = schema.min(min, `${name} phải lớn hơn hoặc bằng ${min}`);
        }
        if (max !== undefined) {
            schema = schema.max(max, `${name} phải nhỏ hơn hoặc bằng ${max}`);
        }
        return schema;
    },
    price: (name: string = "Giá tiền", max: number = 1_000_000_000) =>
        z.coerce
            .number({
                message: `Vui lòng nhập ${name.toLowerCase()}`,

            })
            .positive(`${name} phải lớn hơn 0`)
            .max(max, `${name} không được vượt quá ${max.toLocaleString('vi-VN')}đ`),
    boolean: (name: string) =>
        z.coerce.boolean({
            message: `Vui lòng chọn ${name.toLowerCase()}`,
        }),
    // 8. FILE (Upload 1 file đơn lẻ)
    file: (
        name: string,
        options?: { maxSizeMB?: number; acceptedTypes?: string[] }
    ) => {
        const MAX_SIZE_BYTES = (options?.maxSizeMB || 5) * 1024 * 1024; // Mặc định 5MB

        return z.any()
            .refine((file) => file instanceof File, `Vui lòng chọn ${name.toLowerCase()}`)
            .refine((file) => {
                return file?.size <= MAX_SIZE_BYTES;
            }, `${name} vượt quá dung lượng cho phép (${options?.maxSizeMB || 5}MB)`)
            .refine((file) => {
                if (!options?.acceptedTypes) return true;
                return options.acceptedTypes.includes(file?.type);
            }, `Định dạng ${name.toLowerCase()} không được hỗ trợ`);
    },

    // 9. URL (Đường dẫn web)
    url: (name: string = "Đường dẫn") =>
        z.string({ message: `Vui lòng nhập ${name.toLowerCase()}` })
            .trim()
            .min(1, `${name} không được để trống`)
            .url(`${name} phải là một đường dẫn hợp lệ (vd: https://...)`),
    // 10. NGÀY THÁNG BÌNH THƯỜNG (Có thể giới hạn ngày bắt đầu / kết thúc)
    date: (name: string = "Ngày", options?: { minDate?: Date; maxDate?: Date }) => {
        let schema = z.coerce.date({
            message: `Vui lòng chọn ${name.toLowerCase()}`,

        });

        if (options?.minDate) {
            // Ví dụ: Ngày đặt bàn phải từ hôm nay trở đi
            schema = schema.min(options.minDate, `${name} không được nhỏ hơn ngày ${options.minDate.toLocaleDateString('vi-VN')}`);
        }
        if (options?.maxDate) {
            // Ví dụ: Ngày kết thúc khuyến mãi không được vượt quá cuối năm
            schema = schema.max(options.maxDate, `${name} không được vượt quá ngày ${options.maxDate.toLocaleDateString('vi-VN')}`);
        }
        return schema;
    },
    // 11. NGÀY SINH (Validate theo độ tuổi)
    dob: (name: string = "Ngày sinh", options?: { minAge?: number; maxAge?: number }) => {
        return z.coerce.date({
            message: `Vui lòng chọn ${name.toLowerCase()}`,

        })
            .max(new Date(), `${name} không được lớn hơn ngày hiện tại`) // Chắc chắn ngày sinh phải trong quá khứ
            .superRefine((date, ctx) => {
                const today = new Date();
                // Tính tuổi chính xác theo ngày tháng
                let age = today.getFullYear() - date.getFullYear();
                const m = today.getMonth() - date.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                    age--; // Chưa qua sinh nhật năm nay thì trừ đi 1 tuổi
                }

                if (options?.minAge !== undefined && age < options.minAge) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Bạn phải đủ ${options.minAge} tuổi`,
                    });
                }

                if (options?.maxAge !== undefined && age > options.maxAge) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Tuổi không được vượt quá ${options.maxAge}`,
                    });
                }
            });
    },

    enum: <T extends readonly [string, ...string[]]>(
        name: string,
        allowedValues: T
    ) =>
        z.enum(allowedValues, {
            message: `${name} lựa chọn không hợp lệ`
        }),
    array: <T extends z.ZodTypeAny>(
        name: string,
        itemSchema: T,
        options?: { min?: number; max?: number }
    ) => {
        let schema = z.array(itemSchema, {
            message: `Vui lòng cung cấp danh sách ${name.toLowerCase()}`,
            
        });

        if (options?.min !== undefined) {
            schema = schema.min(options.min, `${name} phải có ít nhất ${options.min} phần tử`);
        }
        if (options?.max !== undefined) {
            schema = schema.max(options.max, `${name} không được vượt quá ${options.max} phần tử`);
        }
        return schema;
    },

    // 14. ĐỐI TƯỢNG (Object) - Cần truyền vào cấu trúc của object
    object: <T extends z.ZodRawShape>(
        name: string,
        shape: T
    ) => {
        return z.object(shape, {
            message: `Vui lòng cung cấp thông tin ${name.toLowerCase()}`,
        
        });
    }
}