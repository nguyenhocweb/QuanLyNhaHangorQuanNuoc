import { getBrandOwnersRepo } from "../repositories/account.getBrandOwners.repo.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const getBrandOwnersService = async (search) => {
    const where = {};
    
    if (search) {
        // 1. Luôn luôn tìm kiếm theo các trường Text (String bình thường)
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { sdt: { contains: search, mode: "insensitive" } }
        ];

        // 2. Kiểm tra xem chuỗi search có phải là MongoDB ObjectID hợp lệ không?
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);

        // 3. Nếu là ID hợp lệ, mới thêm vào mảng OR.
        if (isValidObjectId) {
            where.OR.push({ id: search }); 
        }
    }

    const users = await getBrandOwnersRepo(where);

    if (!users || users.length === 0) {
        throw new NotFoundError("Không tìm thấy chủ sở hữu nào phù hợp với từ khóa này.");
    }

    return users;
};
