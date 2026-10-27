import axiosClient from "@/src/core/api/axios-instance";

export interface KioskSessionData {
    table: {
        id: string;
        tableNumber: string;
        minCapacity: number;
        maxCapacity: number;
        status: string;
    };
    restaurant: {
        id: string;
        name: string;
        logoUrl?: string;
        bannerUrl?: string;
        address?: string;
        brand?: {
            id: string;
            name: string;
            logoUrl?: string;
        };
    };
    sessionStatus: "IDLE" | "SEATED";
    guestInfo?: {
        name: string;
        partySize: number;
        occasion?: string;
        specialRequests?: string;
        confirmationCode: string;
    } | null;
    activeReservationId?: string | null;
    activeOrder?: {
        id: string;
        orderNumber: string;
        status: string;
        subtotal: number;
        discountAmount: number;
        taxAmount: number;
        totalAmount: number;
        items: Array<{
            id: string;
            menuItemId: string;
            name: string;
            price: number;
            quantity: number;
            status: string;
            notes?: string;
            imageUrl?: string;
        }>;
    } | null;
}

export const getKioskSessionService = async (restaurantId: string, tableId: string): Promise<{ message: string, metadata: KioskSessionData }> => {
    const res = await axiosClient.get(`/public/table-kiosk/session`, {
        params: { restaurantId, tableId }
    });
    return res.data;
};
