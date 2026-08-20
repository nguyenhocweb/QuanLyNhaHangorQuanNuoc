import { aiFacade } from "../../../shared/llm/llm.facade.js";
import { prisma } from "../../../../databases/init.mongodb.js";
import { BadRequestError } from "../../../../core/constants/error/index.js";

class AiOwnerService {
  handleChat = async ({ prompt, sessionId, user }) => {
    const persona = "owner";
    
    // Tìm brand của user
    const employment = await prisma.employment.findFirst({
        where: { userId: user.id }
    });

    if (!employment || !employment.brandId) {
        throw new BadRequestError("Tài khoản không được liên kết với bất kỳ thương hiệu nào.");
    }

    const context = {
      userId: user.id,
      role: user.role,
      user_name: user.user_name,
      brandId: employment.brandId
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

export const aiOwnerService = new AiOwnerService();
