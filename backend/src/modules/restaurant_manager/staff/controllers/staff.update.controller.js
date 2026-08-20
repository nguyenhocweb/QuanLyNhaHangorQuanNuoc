import { updateStaffService } from "../services/staff.update.service.js";

export const updateStaffController = async (req, res) => {
  const { id } = req.params;
  const restaurantId = req.body.restaurantId || req.query.restaurantId || req.user?.restaurantId;
  const result = await updateStaffService(restaurantId, id, req.body, req.user);

  return res.status(200).json({
    message: "Cập nhật thông tin nhân sự thành công",
    metadata: result,
  });
};
