import { NotFoundError } from "../../../../core/constants/error/index.js";
import { getActiveOrderByReservationRepo } from "../order.repository/dine_in_order.get_by_reservation.repo.js";

export const getActiveOrderByReservationService = async (reservationId) => {
    const data = await getActiveOrderByReservationRepo(reservationId);
    if (!data || !data.reservation) {
        throw new NotFoundError("Không tìm thấy thông tin đặt bàn");
    }

    // 1. Kiểm tra cấu hình Thuế & Phí phục vụ theo thứ tự ưu tiên: Cấp Thương hiệu (Brand) -> Cấp Nhà hàng (Restaurant)
    const brandTaxConfig = data.reservation.restaurant?.brand?.taxConfig;
    const restaurantTaxConfig = data.reservation.restaurant?.taxConfig;

    let effectiveTaxConfig = {
        isVatInclusive: false,
        defaultVatRate: 0,
        applyServiceCharge: false,
        serviceChargeRate: 0,
        source: 'NONE'
    };

    if (brandTaxConfig) {
        if (brandTaxConfig.forceGlobalTaxConfig) {
            // Cấp thương hiệu bắt buộc áp dụng toàn hệ thống
            effectiveTaxConfig = {
                isVatInclusive: brandTaxConfig.isVatInclusive || false,
                defaultVatRate: brandTaxConfig.defaultVatRate || 0,
                applyServiceCharge: brandTaxConfig.applyServiceCharge || false,
                serviceChargeRate: brandTaxConfig.serviceChargeRate || 0,
                source: 'BRAND'
            };
        } else {
            // Cho phép nhà hàng ghi đè nếu nhà hàng có cấu hình riêng, nếu không kế thừa từ Brand
            effectiveTaxConfig = {
                isVatInclusive: restaurantTaxConfig?.isVatInclusive ?? brandTaxConfig.isVatInclusive ?? false,
                defaultVatRate: restaurantTaxConfig?.defaultVatRate ?? brandTaxConfig.defaultVatRate ?? 0,
                applyServiceCharge: restaurantTaxConfig?.applyServiceCharge ?? brandTaxConfig.applyServiceCharge ?? false,
                serviceChargeRate: restaurantTaxConfig?.serviceChargeRate ?? brandTaxConfig.serviceChargeRate ?? 0,
                source: restaurantTaxConfig ? 'RESTAURANT' : 'BRAND'
            };
        }
    } else if (restaurantTaxConfig) {
        effectiveTaxConfig = {
            isVatInclusive: restaurantTaxConfig.isVatInclusive || false,
            defaultVatRate: restaurantTaxConfig.defaultVatRate || 0,
            applyServiceCharge: restaurantTaxConfig.applyServiceCharge || false,
            serviceChargeRate: restaurantTaxConfig.serviceChargeRate || 0,
            source: 'RESTAURANT'
        };
    }

    return {
        message: "Lấy thông tin đơn gọi món thành công",
        metadata: {
            ...data,
            taxConfig: effectiveTaxConfig
        }
    };
};
