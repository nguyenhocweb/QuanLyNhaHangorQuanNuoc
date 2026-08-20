import { getBrandById } from "../../../system_admin/brand/repository.brand/index.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getPublicBrandByIdService = async (_id) => {
    // Gọi trực tiếp repository có sẵn vì query đã bao gồm đầy đủ dữ liệu public cần thiết
    const brand = await getBrandById(_id);
    
    if (!brand) {
        throw new NotFoundError("Không tìm thấy thương hiệu!");
    }
    
    // Đối với public, chỉ nên trả về brand có isActive = 'ACTIVE' (tùy nghiệp vụ, ở đây ta cứ lấy ra trước)
    if (brand.isActive !== "ACTIVE") {
        throw new NotFoundError("Thương hiệu hiện đang bảo trì hoặc chưa kích hoạt.");
    }
    
    return { code: 200, data: brand };
};
