import { ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { updateBrandById } from "../repository.brand/index.js";
import { prisma } from "../../../../databases/init.mongodb.js";

export const updateBrandBasicByAdminService = async (_id, data) => {
    // Check if name is being updated and if it already exists
    if (data.name) {
        const duplicate = await prisma.brand.findFirst({
            where: {
                name: data.name,
                id: { not: _id }
            }
        });
        if (duplicate) {
            throw new ConflictError("Tên thương hiệu đã tồn tại trong hệ thống");
        }
    }

    const isUpdated = await updateBrandById(_id, data);
    
    if (!isUpdated) {
        throw new NotFoundError("Thương hiệu không tồn tại hoặc đã bị xóa");
    }

    return { id: _id };
};
