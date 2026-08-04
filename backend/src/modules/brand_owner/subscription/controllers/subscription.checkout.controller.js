import { checkoutService } from "../services/subscription.checkout.service.js";

class CheckoutController {
  createCheckoutSession = async (req, res) => {
    const brandId = req.params.id_brand; // Từ /brand-owner/:id_brand/...
    const { planId } = req.body;
    const userId = req.user.id;

    const data = await checkoutService.createSession({ brandId, planId, userId });

    return res.status(200).json({
      message: "Tạo phiên thanh toán thành công",
      metadata: data
    });
  }
}

export const checkoutController = new CheckoutController();
