import { aiFacade } from "../../../shared/llm/llm.facade.js";

class AiAdminService {
  handleChat = async ({ prompt, sessionId, user }) => {
    const persona = "admin";
    
    const context = {
      userId: user.id,
      role: user.role,
      user_name: user.user_name
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

export const aiAdminService = new AiAdminService();
