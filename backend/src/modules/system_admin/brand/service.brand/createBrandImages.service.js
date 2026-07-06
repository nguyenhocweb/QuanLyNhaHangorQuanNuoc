import { updateBrandById } from "../repository.brand/index.js";
import { BadRequestError, ConflictError, NotFoundError } from "../../../../core/constants/error/index.js";
import { Prisma } from "../../../../databases/prisma/generated/prisma/index.js";

export const createBrandImagesService = async (_id, data) => {
    const payload = {
        logo: data.logo,
        imageMain: data.imageMain,
        images: data.images,
    };

    if (!payload.logo && !payload.imageMain && !payload.images) {
        throw new BadRequestError("Không có dữ liệu hình ảnh để cập nhật");
    }

    try {
        const updated = await updateBrandById(_id, payload);
        if (!updated) {
            throw new NotFoundError("Thương hiệu không tồn tại");
        }

        return { id: _id, message: "Cập nhật hình ảnh thương hiệu thành công" };
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new ConflictError("Dữ liệu hình ảnh bị trùng");
        }
        throw error;
    }
};
