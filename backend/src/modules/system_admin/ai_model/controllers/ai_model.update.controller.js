import { updateAiModelService } from "../services/ai_model.update.service.js";

export const updateAiModelController = async (req, res) => {
  const data = await updateAiModelService(req.params.id, req.body);
  return res.status(200).json({ message: "Cập nhật thành công", metadata: data });
};