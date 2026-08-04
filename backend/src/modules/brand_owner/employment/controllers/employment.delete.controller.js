import { deleteEmploymentService } from "../services/employment.delete.service.js";

export const deleteEmploymentController = async (req, res) => {
  const { id } = req.params;

  const result = await deleteEmploymentService(id);

  return res.status(200).json({
    message: "Đã xóa nhân viên thành công!",
    metadata: result,
  });
};
