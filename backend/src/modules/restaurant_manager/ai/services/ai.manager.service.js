import { aiFacade } from "../../../shared/llm/llm.facade.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

class AiManagerService {
  handleChat = async ({ prompt, sessionId, user }) => {
    const persona = "manager";
    
    // Tìm restaurant của user
    const employment = await prisma.employment.findFirst({
        where: { userId: user.id },
        include: { restaurant: true } // Lấy thông tin nhà hàng để lấy brandId
    });

    if (!employment || !employment.restaurantId) {
        throw new BadRequestError("Tài khoản không được liên kết với bất kỳ nhà hàng nào.");
    }

    const context = {
      userId: user.id,
      role: user.role,
      user_name: user.user_name,
      restaurantId: employment.restaurantId,
      brandId: employment.restaurant?.brandId // Bổ sung brandId để Router lấy đúng API Key của thương hiệu
    };

    const response = await aiFacade.handleChat({
      prompt,
      sessionId,
      persona,
      context
    });

    return response;
  };
}

export const aiManagerService = new AiManagerService();
