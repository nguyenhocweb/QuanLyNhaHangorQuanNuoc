import { prisma } from "../../../../../databases/init.mongodb.js";
import { createTokenAccess } from "../../../../../core/utils/authUtils.js";
import { BadRequestError, NotFoundError } from "../../../../../core/constants/error/index.js";
import { pairingCodesMap } from "../../../../restaurant_manager/table_kiosk/pairing/services/pairing.store.js";

export const verifyTablePairingCodeService = async (pairingCode, deviceUUID = "") => {
    const cleanCode = pairingCode.toString().trim();
    const pairingData = pairingCodesMap.get(cleanCode);

    if (!pairingData) {
        throw new BadRequestError("Mã kết nối không hợp lệ hoặc đã hết hạn. Vui lòng lấy mã mới trên máy POS.");
    }

    if (pairingData.expiresAt < Date.now()) {
        pairingCodesMap.delete(cleanCode);
        throw new BadRequestError("Mã kết nối đã hết hạn. Vui lòng tạo mã mới.");
    }

    const table = await prisma.tables.findUnique({
        where: { id: pairingData.tableId },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    imageMain: true,
                    address: true
                }
            }
        }
    });

    if (!table) {
        throw new NotFoundError("Bàn không còn tồn tại trong hệ thống");
    }

    const tokenPayload = {
        role: "TABLE_DEVICE",
        restaurantId: pairingData.restaurantId,
        tableId: pairingData.tableId,
        tableNumber: pairingData.tableNumber,
        deviceUUID
    };

    const tableDeviceToken = createTokenAccess(tokenPayload, "365d");

    pairingCodesMap.delete(cleanCode);

    return {
        tableDeviceToken,
        restaurantId: pairingData.restaurantId,
        tableId: pairingData.tableId,
        tableNumber: pairingData.tableNumber,
        restaurant: table.restaurant ? {
            id: table.restaurant.id,
            name: table.restaurant.name,
            logoUrl: table.restaurant.logo,
            bannerUrl: table.restaurant.imageMain,
            address: table.restaurant.address
        } : null
    };
};
