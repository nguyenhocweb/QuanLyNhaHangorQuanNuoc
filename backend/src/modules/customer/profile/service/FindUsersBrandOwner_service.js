import { getUsersBrandOwner } from "../repository/index.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const FindUsersBrandOwnerService = async (search) => {
    const where = {};
    
    if (search) {
        // 1. Luôn luôn tìm kiếm theo các trường Text (String bình thường)
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { sdt: { contains: search, mode: "insensitive" } }
        ];

        // 2. Kiểm tra xem chuỗi search có phải là MongoDB ObjectID hợp lệ không?
        // (Regex kiểm tra chuỗi có chính xác 24 ký tự [0-9, a-f, A-F] hay không)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search);

        // 3. Nếu là ID hợp lệ, mới thêm vào mảng OR.
        // Lưu ý: So sánh bằng (=) trực tiếp, KHÔNG dùng contains với ObjectID
        if (isValidObjectId) {
            where.OR.push({ id: search }); 
        }
    }

    const users = await getUsersBrandOwner(where);

    if (!users || users.length === 0) {
        throw new NotFoundError("Không tìm thấy chủ sở hữu nào phù hợp với từ khóa này.");
    }

    return users;
};