export interface PredefinedMethod {
    name: string;
    code: string;
    description: string;
    iconUrl: string;
    defaultConfig: Record<string, any>;
}

export const PREDEFINED_BRAND_PAYMENT_METHODS: PredefinedMethod[] = [
    {
        name: "VietQR / Chuyển khoản ngân hàng",
        code: "VIETQR",
        description: "Quét mã VietQR chuẩn Napas 24/7 tự động điền số tài khoản, tên chủ tài khoản và số tiền.",
        iconUrl: "https://vietqr.net/img/vietqr-logo.png",
        defaultConfig: {
            bankCode: "970436",
            bankName: "Vietcombank",
            accountNumber: "",
            accountHolder: "",
        }
    },
    {
        name: "Ví điện tử MoMo",
        code: "MOMO",
        description: "Thanh toán qua ví điện tử MoMo (MoMo QR, App to App).",
        iconUrl: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
        defaultConfig: {
            partnerCode: "",
            accessKey: "",
            secretKey: "",
        }
    },
    {
        name: "Cổng thanh toán VNPAY",
        code: "VNPAY",
        description: "Hỗ trợ thanh toán qua hơn 40 ứng dụng ngân hàng và ví điện tử VNPAY-QR.",
        iconUrl: "https://vnpay.vn/assets/images/logo.svg",
        defaultConfig: {
            vnp_TmnCode: "",
            vnp_HashSecret: "",
            vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        }
    },
    {
        name: "Cổng thanh toán PayOS",
        code: "PAYOS",
        description: "Cổng thanh toán mã QR Napas tự động gạch nợ real-time qua Webhook.",
        iconUrl: "https://payos.vn/docs/img/logo.svg",
        defaultConfig: {
            clientId: "",
            apiKey: "",
            checksumKey: "",
        }
    },
    {
        name: "Cổng thanh toán SePay",
        code: "SEPAY",
        description: "Tự động nhận diện biến động số dư và xác nhận thanh toán chuyển khoản.",
        iconUrl: "https://sepay.vn/assets/img/logo.png",
        defaultConfig: {
            apiToken: "",
        }
    },
    {
        name: "Ví ZaloPay",
        code: "ZALOPAY",
        description: "Cổng thanh toán ví điện tử ZaloPay và thẻ thanh toán.",
        iconUrl: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png",
        defaultConfig: {
            appId: "",
            key1: "",
            key2: "",
        }
    },
    {
        name: "Tiền mặt tại bàn",
        code: "CASH",
        description: "Khách hàng thanh toán trực tiếp bằng tiền mặt hoặc thẻ POS cho nhân viên phục vụ.",
        iconUrl: "",
        defaultConfig: {}
    }
];

export const POPULAR_BANKS = [
    { code: '970436', shortName: 'Vietcombank', name: 'Ngân hàng Ngoại thương Việt Nam (VCB)' },
    { code: '970422', shortName: 'MBBank', name: 'Ngân hàng Quân đội (MB)' },
    { code: '970415', shortName: 'VietinBank', name: 'Ngân hàng Công thương Việt Nam (CTG)' },
    { code: '970418', shortName: 'BIDV', name: 'Ngân hàng Đầu tư và Phát triển VN (BIDV)' },
    { code: '970407', shortName: 'Techcombank', name: 'Ngân hàng Kỹ thương Việt Nam (TCB)' },
    { code: '970416', shortName: 'ACB', name: 'Ngân hàng Á Châu (ACB)' },
    { code: '970432', shortName: 'VPBank', name: 'Ngân hàng Việt Nam Thịnh Vượng (VPB)' },
    { code: '970423', shortName: 'TPBank', name: 'Ngân hàng Tiên Phong (TPB)' },
    { code: '970403', shortName: 'Sacombank', name: 'Ngân hàng Sài Gòn Thương Tín (STB)' },
    { code: '970441', shortName: 'VIB', name: 'Ngân hàng Quốc Tế (VIB)' },
    { code: '970437', shortName: 'HDBank', name: 'Ngân hàng Phát triển TP.HCM (HDB)' },
    { code: '970426', shortName: 'MSB', name: 'Ngân hàng Hàng Hải (MSB)' },
];
