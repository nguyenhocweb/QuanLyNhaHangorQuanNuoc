import axiosClient from "@/src/core/api/axios-instance";

export interface GeneratePairingResponse {
    pairingCode: string;
    tableNumber: string;
    restaurantName: string;
    expiresInSeconds: number;
    expiresAt: string;
}

// POS Quản lý nhà hàng sinh mã PIN 6 số cho bàn
export const generateTablePairingService = async (tableId: string, restaurantId?: string): Promise<{ message: string, metadata: GeneratePairingResponse }> => {
    const res = await axiosClient.post(`/restaurant-manager/table-kiosk/pairing/generate`, {
        tableId,
        ...(restaurantId && { restaurantId })
    });
    return res.data;
};
