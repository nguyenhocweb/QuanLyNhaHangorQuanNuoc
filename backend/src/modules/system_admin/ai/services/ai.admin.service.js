import { aiFacade } from "../../../shared/llm/llm.facade.js";

class AiAdminService {
  handleChat = async ({ prompt, sessionId, user }) => {
    const persona = "admin";
    
    const roleName = user?.systemRole 
      ? (typeof user.systemRole === 'object' ? user.systemRole.name : user.systemRole)
      : (typeof user?.role === 'object' ? user.role.name : user?.role) || "Admin";

    const context = {
      userId: user?.id,
      role: roleName,
      systemRole: roleName,
      user_name: user?.user_name || user?.name || "Admin"
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
