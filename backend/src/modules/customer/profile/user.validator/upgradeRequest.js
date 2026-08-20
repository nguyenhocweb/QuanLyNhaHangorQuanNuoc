import { z } from "zod";

const upgradeRequest = {
    body: z.object({
        brandName: z.string({
            required_error: "Tên thương hiệu là bắt buộc",
            invalid_type_error: "Tên thương hiệu phải là chuỗi"
        }).min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
        
        taxCode: z.string({
            invalid_type_error: "Mã số thuế phải là chuỗi"
        }).optional(),
        
        businessLicense: z.string({
            required_error: "Vui lòng tải lên giấy phép kinh doanh",
            invalid_type_error: "Giấy phép kinh doanh phải là đường dẫn URL"
        }).url("Đường dẫn giấy phép kinh doanh không hợp lệ")
    })
};

export default upgradeRequest;
