import axiosClient from "@/src/core/api/axios-instance";
import { ActiveOrderResponse, CreateDineInOrderPayload, RestaurantMenuData } from "../type/dine_in_order.type";

/**
 * Lấy danh sách thực đơn của nhà hàng
 */
export const getDineInMenuService = async (restaurantId: string): Promise<{ message?: string; metadata: RestaurantMenuData[] }> => {
    const response = await axiosClient.get(`/restaurant/v2/${restaurantId}/menu`);
    return response.data;
};

/**
 * Lấy thông tin đơn gọi món đang hoạt động theo mã đặt bàn
 */
export const getActiveOrderByReservationService = async (reservationId: string): Promise<{ message: string; metadata: ActiveOrderResponse }> => {
    const response = await axiosClient.get(`/customer/order/active-by-reservation/${reservationId}`);
    return response.data;
};

/**
 * Gửi yêu cầu gọi món xuống bếp
 */
export const createDineInOrderService = async (payload: CreateDineInOrderPayload): Promise<{ message: string; metadata: any }> => {
    const response = await axiosClient.post('/customer/order/dine-in', payload);
    return response.data;
};
