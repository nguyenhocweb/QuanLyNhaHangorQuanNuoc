import { getStaffsService } from "../services/staff.get.service.js";

export const getStaffsController = async (req, res) => {
  const restaurantId = req.query.restaurantId || req.user?.restaurantId;
  const result = await getStaffsService(restaurantId, req.query, req.user);

  return res.status(200).json({
    message: "Lấy danh sách nhân sự chi nhánh thành công",
    metadata: result,
  });
};
