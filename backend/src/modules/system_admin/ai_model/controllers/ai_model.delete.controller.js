import { deleteAiModelService } from "../services/ai_model.delete.service.js";

export const deleteAiModelController = async (req, res) => {
  await deleteAiModelService(req.params.id);
  return res.status(200).json({ message: "Xóa thành công", metadata: {} });
};