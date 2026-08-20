import { NotFoundError } from "../../../../core/constants/error/index.js";
import { updateBrandById } from "../repository.brand/index.js";

export const deleteBrandByAdminService = async (_id) => {
    // Soft delete: change status to TERMINATED
    const data = { isActive: "TERMINATED" };
    
    const isUpdated = await updateBrandById(_id, data);
    
    if (!isUpdated) {
        throw new NotFoundError("Thương hiệu không tồn tại hoặc đã bị xóa");
    }

    return { id: _id };
};
