import { processCheckoutService } from "../services/cashier.checkout.service.js";

export const processCheckout = async (req, res) => {
  const restaurantId = req.headers["restaurantid"] || req.user.restaurantId;
  const result = await processCheckoutService(restaurantId, req.body);
  res.status(200).json({
    message: "Thanh toán thành công!",
    metadata: result
  });
};
