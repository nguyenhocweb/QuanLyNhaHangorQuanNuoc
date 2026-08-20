import { aiAdminService } from "../services/ai.admin.service.js";

class AiAdminController {
  chat = async (req, res) => {
    const { prompt, sessionId } = req.body;
    const user = req.user; 
    
    const result = await aiAdminService.handleChat({ prompt, sessionId, user });
    
    res.json({
      message: "Success",
      metadata: result
    });
  };
}

export const aiAdminController = new AiAdminController();
