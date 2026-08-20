import { getPermissionsService } from "../services/permission.get.service.js";

export const getPermissionsController = async (req, res, next) => {
  const result = await getPermissionsService();

  return res.status(200).json({
    message: "Lấy danh sách quyền hạn thành công",
    metadata: result,
  });
};
