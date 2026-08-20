import { PayOSGateway } from "./gateways/payos.gateway.js";
import { VietQRGateway } from "./gateways/vietqr.gateway.js";

export class PaymentFactory {
    /**
     * Khởi tạo Gateway phù hợp dựa trên mã cổng thanh toán và cấu hình (config)
     * @param {string} gatewayCode Mã cổng thanh toán (VD: PAYOS, VIETQR, MOMO)
     * @param {object} config Cấu hình (API keys, account info) lấy từ DB
     * @returns Instance của Gateway tương ứng
     */
    static getGateway(gatewayCode, config) {
        switch (gatewayCode.toUpperCase()) {
            case 'PAYOS':
                return new PayOSGateway(config);
            case 'VIETQR':
                return new VietQRGateway(config);
            // Thêm các case khác như MOMO, VNPAY sau này
            default:
                throw new Error(`Cổng thanh toán ${gatewayCode} chưa được hỗ trợ.`);
        }
    }
}
