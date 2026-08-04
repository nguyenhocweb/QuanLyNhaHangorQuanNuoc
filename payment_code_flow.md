# Code Hoàn Chỉnh: Quy Trình Thanh Toán SePay Cá Nhân (Webhook)

Tài liệu này chứa các đoạn code chi tiết minh họa toàn bộ vòng đời của một luồng thanh toán QR Động (Mô hình SePay cá nhân, không lưu API Key). 
Khi nào cần áp dụng, bạn có thể copy các đoạn code này vào các module tương ứng.

---

## 1. BACKEND: Đăng Ký Tài Khoản Nhận Tiền
Khi nhà hàng khai báo thông tin ngân hàng của họ.

**`backend/src/modules/system_admin/payment/controllers/config.controller.js`**
```javascript
import crypto from 'crypto';
import { prisma } from "../../../../databases/init.mongodb.js";

export const createPaymentConfig = async (req, res) => {
    const { restaurantId, bankId, accountNo, accountName } = req.body;

    // 1. Sinh một chuỗi Webhook Token duy nhất (Secret) cho nhà hàng này
    const webhookToken = crypto.randomBytes(16).toString('hex');

    // 2. Gom thành cục JSON configData
    const configData = {
        bankId,
        accountNo,
        accountName,
        webhookToken
    };

    // 3. Lưu vào Database (Giả định SystemPaymentMethodId là id của VietQR/SePay)
    const config = await prisma.restaurantPaymentConfig.create({
        data: {
            restaurantId,
            brandId: req.user.brandId,
            systemPaymentMethodId: "ID_CUA_VIETQR", 
            configData: configData,
            isActive: true
        }
    });

    // 4. Sinh URL Webhook để trả về cho chủ nhà hàng copy dán vào app SePay
    const webhookUrlForSePay = `https://api.domain.com/api/v1/payment/sepay-webhook?token=${webhookToken}`;

    return res.status(200).json({
        success: true,
        message: "Cấu hình thành công. Vui lòng dán link sau vào App SePay",
        data: webhookUrlForSePay
    });
};
```

---

## 2. BACKEND & FRONTEND: Sinh Mã QR Khi Khách Chốt Đơn

Khách hàng bấm "Thanh toán".

**`backend/src/modules/system_admin/payment/controllers/qr.controller.js`**
```javascript
export const generateQrCode = async (req, res) => {
    const { orderId } = req.body;

    // 1. Lấy thông tin đơn hàng
    const order = await prisma.order.findUnique({ where: { id: orderId }});
    
    // 2. Lấy cấu hình ngân hàng của nhà hàng sở hữu đơn đó
    // Giả định order.table.restaurantId có tồn tại (hoặc lưu nhà hàng lúc tạo order)
    const paymentConfig = await prisma.restaurantPaymentConfig.findFirst({
        where: { restaurantId: order.restaurantId, isActive: true }
    });

    const bankInfo = paymentConfig.configData; // Chứa bankId, accountNo, accountName

    // 3. Tạo link ảnh QR tĩnh từ VietQR
    // Format: PAY O{Mã Đơn}. Ví dụ: PAY O83921
    const addInfo = `PAY O${order.order_number}`;
    const amount = order.total_amount;
    
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    return res.status(200).json({
        success: true,
        qrUrl: qrUrl
    });
};
```

**`fe/src/features/payment/QRPaymentModal.tsx`**
```tsx
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const QRPaymentModal = ({ orderId }) => {
    // 1. Gọi API lấy link ảnh QR
    const { data: qrData } = useQuery({
        queryKey: ['generateQR', orderId],
        queryFn: () => axios.post('/api/v1/payment/qr-generate', { orderId })
    });

    // 2. Chạy Polling (Ping API liên tục mỗi 3s) để kiểm tra trạng thái đơn hàng
    const { data: orderData } = useQuery({
        queryKey: ['orderStatus', orderId],
        queryFn: () => axios.get(`/api/v1/orders/${orderId}`),
        refetchInterval: 3000, // 3 giây gọi 1 lần
        enabled: !!qrData // Chỉ ping khi đã có QR
    });

    // Nếu API trả về PAID -> Dừng quét, báo thành công
    if (orderData?.status === 'PAID') {
        return <div className="text-green-500 text-2xl">Thanh toán thành công!</div>;
    }

    return (
        <div>
            <h2>Quét mã để thanh toán</h2>
            {qrData?.qrUrl && <img src={qrData.qrUrl} alt="VietQR" />}
            <p>Đang chờ thanh toán...</p>
        </div>
    );
};
```

---

## 3. BACKEND: Nhận Webhook Từ SePay & Cập Nhật DB

Lúc này khách đã quét và chuyển tiền. Tiền vào NH của chủ quán. App SePay của chủ quán thấy có tiền liền gọi API của Server chúng ta.

**`backend/src/modules/public/webhook/sepay.controller.js`**
```javascript
export const handleSepayWebhook = async (req, res) => {
    try {
        // 1. Xác thực Token (Tránh bị hack)
        const token = req.query.token;
        if (!token) return res.status(403).json({ error: "No token provided" });

        const config = await prisma.restaurantPaymentConfig.findFirst({
            where: {
                configData: {
                    path: '$.webhookToken', // Query JSON trong MongoDB/Postgres
                    equals: token
                }
            }
        });

        if (!config) return res.status(403).json({ error: "Invalid token" });

        // 2. Bóc tách dữ liệu từ SePay gửi tới
        // SePay thường gửi: { id, gateway, transactionDate, accountNumber, subAccount, amountIn, amountOut, accumulated, code, transactionContent, referenceNumber, body }
        const { amountIn, transactionContent } = req.body;

        // Nếu là giao dịch chuyển đi (amountOut > 0) hoặc không có tiền vào thì bỏ qua
        if (!amountIn || amountIn <= 0) return res.status(200).json({ success: true });

        // 3. Dùng Regex để tìm mã đơn hàng trong nội dung chuyển khoản
        // Ví dụ: "Nguyen Van A chuyen tien PAY O12345"
        const regex = /PAY O([A-Za-z0-9]+)/i; 
        const match = transactionContent.match(regex);

        if (match && match[1]) {
            const orderNumber = match[1];

            // 4. Tìm đơn hàng
            const order = await prisma.order.findUnique({
                where: { order_number: orderNumber }
            });

            if (order && order.status !== 'PAID') {
                // Kiểm tra xem khách chuyển đủ tiền không
                if (amountIn >= order.total_amount) {
                    // Cập nhật Database
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'PAID', paid_at: new Date() }
                    });

                    // (Tại đây, vòng lặp Polling 3s ở FE sẽ nhận được status 'PAID' và chuyển UI)
                }
            }
        }

        // 5. Luôn trả về 200 cho SePay để nó không gửi lại
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Sepay Webhook Error:", error);
        return res.status(200).json({ success: false }); 
    }
};
```
