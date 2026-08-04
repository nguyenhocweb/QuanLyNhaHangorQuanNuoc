import { createStaffService } from "../services/staff.create.service.js";

export const createStaffController = async (req, res) => {
  const restaurantId = req.body.restaurantId || req.query.restaurantId || req.user?.restaurantId;
  const result = await createStaffService(restaurantId, req.body, req.user);

  return res.status(201).json({
    message: "Thêm nhân sự vào chi nhánh thành công",
    metadata: result,
  });
};
