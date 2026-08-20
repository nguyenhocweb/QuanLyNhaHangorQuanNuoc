import { prisma } from "../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../core/constants/error/index.js";

export const updateApiKeyRepo = async (id, data, brandId) => {
  const whereClause = { id };
  if (brandId !== undefined) {
    whereClause.brandId = brandId;
  }

  // Kiểm tra quyền sở hữu
  const existingKey = await prisma.apiKey.findFirst({
    where: whereClause
  });

  if (!existingKey) {
    throw new NotFoundError("Không tìm thấy API Key này hoặc bạn không có quyền");
  }

  return await prisma.apiKey.update({
    where: { id },
    data
  });
};
