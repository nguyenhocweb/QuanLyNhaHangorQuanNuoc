import { getAiModelsService, getActiveAiModelsService } from "../services/ai_model.get.service.js";

export const getAiModelsController = async (req, res) => {
  const data = await getAiModelsService(req.query);
  return res.status(200).json({ message: "Lấy danh sách thành công", metadata: data });
};

export const getActiveAiModelsController = async (req, res) => {
  const { chatboxId } = req.query;
  const data = await getActiveAiModelsService(chatboxId);
  return res.status(200).json({ message: "Lấy danh sách Active thành công", metadata: data });
};