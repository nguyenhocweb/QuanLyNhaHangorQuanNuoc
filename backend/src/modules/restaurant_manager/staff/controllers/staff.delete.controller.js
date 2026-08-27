import { deleteStaffService } from "../services/staff.delete.service.js";

export const deleteStaffController = async (req, res) => {
  const { id } = req.params;
  const restaurantId = req.params.restaurantId || req.query.restaurantId || req.body.restaurantId || req.user?.restaurantId;
  const result = await deleteStaffService(restaurantId, id, req.user);

  return res.status(200).json({
    message: "Rút biên chế nhân viên khỏi chi nhánh thành công",
    metadata: result,
  });
};
