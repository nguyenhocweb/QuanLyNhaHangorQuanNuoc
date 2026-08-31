import { prisma } from "../../../../databases/init.mongodb.js";

/**
 * Lấy tất cả phương thức thanh toán toàn sàn kèm cấu hình của Brand cụ thể
 */
export const getBrandPaymentConfigsRepo = async (brandId) => {
    // 1. Lấy tất cả phương thức thanh toán đang hoạt động trong hệ thống
    let systemMethods = await prisma.systemPaymentMethod.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
    });

    // Nếu hệ thống chưa có phương thức thanh toán nào, tự động khởi tạo các cổng tiêu chuẩn
    if (systemMethods.length === 0) {
        const defaults = [
            {
                name: "VietQR / Chuyển khoản ngân hàng",
                code: "VIETQR",
                description: "Quét mã VietQR chuẩn Napas 24/7 tự động điền số tài khoản và nội dung",
                iconUrl: "https://vietqr.net/img/vietqr-logo.png",
                isActive: true
            },
            {
                name: "Ví điện tử MoMo",
                code: "MOMO",
                description: "Thanh toán qua ví điện tử MoMo hoặc quét mã MoMo QR",
                iconUrl: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                isActive: true
            },
            {
                name: "Cổng thanh toán VNPAY",
                code: "VNPAY",
                description: "Thanh toán qua cổng VNPAY hỗ trợ hơn 40 ứng dụng ngân hàng",
                iconUrl: "https://vnpay.vn/assets/images/logo.svg",
                isActive: true
            },
            {
                name: "Cổng thanh toán PayOS",
                code: "PAYOS",
                description: "Cổng thanh toán mã QR Napas tự động gạch nợ real-time",
                iconUrl: "https://payos.vn/docs/img/logo.svg",
                isActive: true
            },
            {
                name: "Tiền mặt tại bàn",
                code: "CASH",
                description: "Khách hàng thanh toán trực tiếp bằng tiền mặt cho nhân viên phục vụ",
                iconUrl: null,
                isActive: true
            }
        ];

        for (const item of defaults) {
            await prisma.systemPaymentMethod.upsert({
                where: { code: item.code },
                update: {},
                create: item
            });
        }

        systemMethods = await prisma.systemPaymentMethod.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
    }

    // 2. Lấy cấu hình của Brand
    const brandConfigs = await prisma.brandPaymentConfig.findMany({
        where: { brandId },
        include: {
            systemPaymentMethod: true
        }
    });

    // 3. Lấy thông tin Brand
    const brand = await prisma.brand.findUnique({
        where: { id: brandId },
        select: {
            id: true,
            name: true,
            logo: true
        }
    });

    return {
        systemMethods,
        brandConfigs,
        brand
    };
};

/**
 * Tạo mới phương thức thanh toán (Cho phép Brand Owner thêm cổng mới)
 */
export const createBrandPaymentMethodRepo = async ({ name, code, description, iconUrl, isActive = true }) => {
    return await prisma.systemPaymentMethod.create({
        data: {
            name,
            code: code.trim().toUpperCase(),
            description: description || null,
            iconUrl: iconUrl || null,
            isActive
        }
    });
};

/**
 * Lấy chi tiết cấu hình của 1 phương thức thanh toán cho Brand
 */
export const getBrandPaymentConfigByMethodRepo = async (brandId, systemPaymentMethodId) => {
    return await prisma.brandPaymentConfig.findUnique({
        where: {
            brandId_systemPaymentMethodId: {
                brandId,
                systemPaymentMethodId
            }
        },
        include: {
            systemPaymentMethod: true
        }
    });
};
