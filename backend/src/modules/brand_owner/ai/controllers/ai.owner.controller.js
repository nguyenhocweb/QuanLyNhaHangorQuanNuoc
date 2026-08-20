import { aiOwnerService } from "../services/ai.owner.service.js";

class AiOwnerController {
  chat = async (req, res) => {
    const { prompt, sessionId } = req.body;
    const user = req.user; 
    
    const result = await aiOwnerService.handleChat({ prompt, sessionId, user });
    
    res.json({
      message: "Success",
      metadata: result
    });
  };
}

export const aiOwnerController = new AiOwnerController();
