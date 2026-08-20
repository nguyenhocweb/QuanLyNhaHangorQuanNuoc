import { aiFacade } from "../../../shared/llm/llm.facade.js";

class AiCustomerService {
  handleChat = async ({ prompt, sessionId, restaurantId, user }) => {
    const persona = "customer";
    
    const context = {
      userId: user.id,
      role: user.role,
      user_name: user.user_name,
      restaurantId // Khách hàng phải truyền restaurantId họ đang xem để lấy đúng menu
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

export const aiCustomerService = new AiCustomerService();
