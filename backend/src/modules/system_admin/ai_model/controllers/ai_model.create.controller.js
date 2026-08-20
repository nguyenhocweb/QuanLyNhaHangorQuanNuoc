import { createAiModelService } from "../services/ai_model.create.service.js";

export const createAiModelController = async (req, res) => {
  const data = await createAiModelService(req.body);
  return res.status(201).json({ message: "Thêm Model thành công", metadata: data });
};