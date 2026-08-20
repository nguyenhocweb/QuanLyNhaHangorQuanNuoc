import { aiCustomerService } from "../services/ai.customer.service.js";

class AiCustomerController {
  chat = async (req, res) => {
    const { prompt, sessionId, restaurantId } = req.body;
    const user = req.user; 
    
    const result = await aiCustomerService.handleChat({ prompt, sessionId, restaurantId, user });
    
    res.json({
      message: "Success",
      metadata: result
    });
  };
}

export const aiCustomerController = new AiCustomerController();
