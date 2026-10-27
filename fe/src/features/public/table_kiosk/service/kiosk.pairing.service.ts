import axiosClient from "@/src/core/api/axios-instance";

export interface VerifyPairingResponse {
    tableDeviceToken: string;
    restaurantId: string;
    tableId: string;
    tableNumber: string;
    restaurant: any;
}

// Tablet Kiosk gửi mã PIN 6 số để xác thực
export const verifyTablePairingService = async (pairingCode: string, deviceUUID?: string): Promise<{ message: string, metadata: VerifyPairingResponse }> => {
    const res = await axiosClient.post(`/public/table-kiosk/pairing/verify`, {
        pairingCode,
        deviceUUID
    });
    return res.data;
};
