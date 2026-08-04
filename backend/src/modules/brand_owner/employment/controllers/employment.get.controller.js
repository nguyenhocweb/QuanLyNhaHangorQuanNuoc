import { getEmploymentsService } from "../services/employment.get.service.js";

export const getEmploymentsController = async (req, res, next) => {
  const { id_brand } = req.params;
  
  const result = await getEmploymentsService(id_brand, req.query);

  return res.status(200).json({
    message: "Lấy danh sách nhân viên thành công",
    metadata: result,
  });
};
