import axiosClient from "@/src/core/api/axios-instance";

export interface PlaceKioskOrderPayload {
    restaurantId: string;
    tableId: string;
    items: Array<{
        menuItemId: string;
        quantity: number;
        notes?: string;
    }>;
    reservationId?: string;
    customerNotes?: string;
}

export const placeKioskOrderService = async (payload: PlaceKioskOrderPayload): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post(`/public/table-kiosk/order`, payload);
    return res.data;
};

export interface CancelKioskOrderItemPayload {
    restaurantId: string;
    tableId: string;
    orderItemId: string;
    reason?: string;
}

export const cancelTableKioskOrderItemService = async (payload: CancelKioskOrderItemPayload): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post(`/public/table-kiosk/order/cancel-item`, payload);
    return res.data;
};

export interface ApplyKioskPromotionPayload {
    restaurantId: string;
    tableId: string;
    code: string;
}

export const applyKioskPromotionService = async (payload: ApplyKioskPromotionPayload): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post(`/public/table-kiosk/order/apply-promotion`, payload);
    return res.data;
};

export const removeKioskPromotionService = async (payload: { restaurantId: string; tableId: string }): Promise<{ message: string; metadata: any }> => {
    const res = await axiosClient.post(`/public/table-kiosk/order/remove-promotion`, payload);
    return res.data;
};

