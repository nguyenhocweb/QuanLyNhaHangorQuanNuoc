import { createEmploymentService } from "../services/employment.create.service.js";

export const createEmploymentController = async (req, res, next) => {
  const { id_brand } = req.params;
  const payload = req.body;

  const result = await createEmploymentService(id_brand, payload);

  const message = payload.userId ? "Liên kết tài khoản nhân viên thành công" : "Tạo tài khoản nhân viên thành công";
  const status = payload.userId ? 200 : 201;

  return res.status(status).json({
    message,
    metadata: result,
  });
};
