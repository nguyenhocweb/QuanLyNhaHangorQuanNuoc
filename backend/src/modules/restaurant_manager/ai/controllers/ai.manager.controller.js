import { aiManagerService } from "../services/ai.manager.service.js";

class AiManagerController {
  chat = async (req, res) => {
    const { prompt, sessionId } = req.body;
    const user = req.user; 
    
    const result = await aiManagerService.handleChat({ prompt, sessionId, user });
    
    res.json({
      message: "Success",
      metadata: result
    });
  };
}

export const aiManagerController = new AiManagerController();
