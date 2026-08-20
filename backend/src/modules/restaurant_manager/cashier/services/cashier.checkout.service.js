import { prisma } from "../../../../databases/init.mongodb.js";
import { BadRequestError, NotFoundError } from "../../../../core/constants/error/index.js";

export const processCheckoutService = async (restaurantId, data) => {
  const { orderId, payments, surchargeAmount = 0, tipAmount = 0, discountReason, loyaltyPointsUsed = 0 } = data;

  const order = await prisma.order.findUnique({ 
    where: { id: orderId },
    include: {
      items: {
        include: { menuItem: true } // Fetch menuItem to get tax overrides
      }
    }
  });
  if (!order || order.restaurantId !== restaurantId) {
    throw new NotFoundError("Không tìm thấy đơn hàng");
  }

  if (order.paymentStatus === "PAID") {
    throw new BadRequestError("Đơn hàng đã được thanh toán");
  }

  // Fetch restaurant config and its brand for taxes
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { 
      isVatInclusive: true, defaultVatRate: true, serviceChargeRate: true, applyServiceCharge: true,
      brand: {
        select: {
          isVatInclusive: true, defaultVatRate: true, serviceChargeRate: true, applyServiceCharge: true, forceGlobalTaxConfig: true
        }
      }
    }
  });

  if (!restaurant) {
    throw new NotFoundError("Không tìm thấy nhà hàng");
  }

  // Thuật toán Runtime Resolution cho Tax/Fee Config
  const activeTaxConfig = (restaurant.brand && restaurant.brand.forceGlobalTaxConfig) 
    ? restaurant.brand 
    : restaurant;

  const { isVatInclusive, defaultVatRate, serviceChargeRate, applyServiceCharge } = activeTaxConfig;

  // Calculate total amount to pay
  const subtotal = order.subtotal + surchargeAmount;
  
  // Calculate Service Charge
  const actualServiceChargeRate = applyServiceCharge ? serviceChargeRate : 0;
  const serviceChargeAmount = subtotal * (actualServiceChargeRate / 100);
  const amountSubjectToTax = subtotal + serviceChargeAmount;

  // Calculate VAT (Item-level or default)
  let taxAmount = 0;
  let taxDetails = { defaultVatRate, serviceChargeAmount, itemsTax: {} };

  // Calculate Tax per item based on inclusive/exclusive and overrides
  order.items.forEach(item => {
    // Tỷ lệ cho item này so với tổng subtotal gốc (để phân bổ service charge và surcharge)
    const proportion = item.totalPrice / (order.subtotal || 1);
    const itemSubjectToTax = item.totalPrice + (surchargeAmount * proportion) + (serviceChargeAmount * proportion);

    const isExempt = item.menuItem?.isTaxExempt || false;
    const itemTaxRate = isExempt ? 0 : (item.menuItem?.taxRateOverride ?? defaultVatRate);
    
    let itemTax = 0;
    if (isVatInclusive) {
      // Giá đã bao gồm thuế -> bóc tách thuế ra
      // itemSubjectToTax = Giá thực tế + Giá thực tế * itemTaxRate / 100
      // Giá thực tế = itemSubjectToTax / (1 + itemTaxRate / 100)
      const basePrice = itemSubjectToTax / (1 + (itemTaxRate / 100));
      itemTax = itemSubjectToTax - basePrice;
    } else {
      // Giá chưa bao gồm thuế -> cộng thêm vào
      itemTax = itemSubjectToTax * (itemTaxRate / 100);
    }
    
    taxAmount += itemTax;
    
    // Ghi lại chi tiết
    if (itemTaxRate > 0) {
      const rateKey = `VAT_${itemTaxRate}%`;
      taxDetails.itemsTax[rateKey] = (taxDetails.itemsTax[rateKey] || 0) + itemTax;
    }
  });

  const discount = order.discount_amount;
  
  // Tính tổng
  // Nếu Giá Đã Bao Gồm Thuế (Inclusive), tổng tiền không cộng thêm taxAmount nữa (vì đã nằm trong subtotal/service charge)
  // Nếu Giá Chưa Bao Gồm Thuế (Exclusive), tổng tiền = subtotal + serviceCharge + taxAmount
  const totalAmount = (isVatInclusive ? amountSubjectToTax : amountSubjectToTax + taxAmount) - discount + tipAmount;

  // Calculate total paid by customer in this request
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  if (totalPaid < totalAmount - 100) { // Allow minor rounding differences
    throw new BadRequestError(`Số tiền thanh toán (${totalPaid}) chưa đủ tổng hóa đơn (${totalAmount.toFixed(0)})`);
  }

  const paymentStatus = "PAID";
  const orderStatus = "PAID";

  return prisma.$transaction(async (tx) => {
    // 1. Update Order
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        surcharge_amount: surchargeAmount,
        tip_amount: tipAmount,
        discount_reason: discountReason,
        loyaltyPointsUsed: loyaltyPointsUsed,
        tax_amount: taxAmount,
        taxDetails: taxDetails,
        total_amount: totalAmount,
        paymentStatus,
        status: orderStatus,
        paid_at: new Date(),
      }
    });

    // 2. Create Transactions for Split Bills
    for (const payment of payments) {
      await tx.transaction.create({
        data: {
          orderId,
          amount: payment.amount,
          systemPaymentMethodId: payment.systemPaymentMethodId,
          status: "SUCCESS"
        }
      });
    }

    // 3. Clear the table
    if (order.tableId) {
      await tx.tables.update({
        where: { id: order.tableId },
        data: { status: "CLEANING" }
      });
    }

    return updatedOrder;
  });
};
