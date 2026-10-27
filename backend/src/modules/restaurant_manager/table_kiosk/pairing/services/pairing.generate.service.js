import { prisma } from "../../../../../databases/init.mongodb.js";
import { NotFoundError } from "../../../../../core/constants/error/index.js";
import { pairingCodesMap } from "./pairing.store.js";

export const generateTablePairingCodeService = async (restaurantId, tableId) => {
    const table = await prisma.tables.findFirst({
        where: {
            id: tableId,
            ...(restaurantId && { restaurantId })
        },
        include: {
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    brandId: true
                }
            }
        }
    });

    if (!table) {
        throw new NotFoundError("Không tìm thấy bàn yêu cầu");
    }

    const finalRestaurantId = restaurantId || table.restaurantId;

    // Xóa mã cũ của bàn này nếu có
    for (const [code, data] of pairingCodesMap.entries()) {
        if (data.tableId === tableId) {
            pairingCodesMap.delete(code);
        }
    }

    // Sinh mã PIN 6 số ngẫu nhiên
    let pairingCode = "";
    do {
        pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (pairingCodesMap.has(pairingCode));

    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 phút

    pairingCodesMap.set(pairingCode, {
        restaurantId: finalRestaurantId,
        tableId,
        tableNumber: table.table_number,
        restaurantName: table.restaurant?.name,
        expiresAt
    });

    return {
        pairingCode,
        tableNumber: table.table_number,
        restaurantName: table.restaurant?.name,
        expiresInSeconds: 300,
        expiresAt: new Date(expiresAt).toISOString()
    };
};
