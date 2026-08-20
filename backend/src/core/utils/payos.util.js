import { PayOS } from "@payos/node";

/**
 * Khởi tạo đối tượng PayOS với cấu hình từ System, Brand hoặc Restaurant
 * @param {Object} config - Cấu hình PayOS (clientId, apiKey, checksumKey)
 * @returns {PayOS}
 */
export const createPayOSInstance = (config) => {
  if (!config || !config.clientId || !config.apiKey || !config.checksumKey) {
    throw new Error("Cấu hình PayOS không hợp lệ hoặc bị thiếu");
  }

  // PayOS SDK v2 requires an object
  return new PayOS({
    clientId: config.clientId,
    apiKey: config.apiKey,
    checksumKey: config.checksumKey
  });
};

/**
 * Xác thực Webhook Data từ PayOS gửi về
 * @param {Object} webhookData - req.body nhận được từ PayOS Webhook
 * @param {Object} config - Cấu hình PayOS (để lấy checksumKey)
 * @returns {Object} Dữ liệu đã được xác thực (verifiedData)
 */
export const verifyPayOSWebhookData = (webhookData, config) => {
  const payos = createPayOSInstance(config);
  try {
    // verifyPaymentWebhookData sẽ kiểm tra signature và trả về data nếu hợp lệ
    const verifiedData = payos.webhooks.verify(webhookData);
    return verifiedData;
  } catch (error) {
    console.error("Lỗi xác thực chữ ký Webhook PayOS:", error.message);
    throw new Error("Xác thực Webhook thất bại. Chữ ký không hợp lệ!");
  }
};
