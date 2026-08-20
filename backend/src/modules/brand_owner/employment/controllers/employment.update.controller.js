import { updateEmploymentService } from "../services/employment.update.service.js";

export const updateEmploymentController = async (req, res) => {
  const { id } = req.params; // Đây là employmentId
  const payload = req.body;

  const result = await updateEmploymentService(id, payload);

  return res.status(200).json({
    message: "Cập nhật thông tin nhân viên thành công!",
    metadata: result,
  });
};
