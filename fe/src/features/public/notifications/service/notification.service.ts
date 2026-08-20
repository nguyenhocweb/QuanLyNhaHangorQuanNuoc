import axiosClient from "@/src/core/api/axios-instance";
import { GetNotificationsResponse } from "../type/notification.type";

interface GetNotificationsParams {
  workspaceType: string; // CUSTOMER | RESTAURANT | BRAND
  workspaceId?: string;
  type?: string;
  page?: number;
  limit?: number;
}

const getNotificationUrl = (workspaceType: string, workspaceId?: string) => {
  switch (workspaceType) {
    case 'CUSTOMER': return '/customer/notifications';
    case 'BRAND': return `/brand-owner/${workspaceId}/notifications`;
    case 'RESTAURANT': return '/restaurant-manager/notifications';
    case 'SYSTEM_ADMIN': return '/system-admin/notifications';
    default: return '/customer/notifications';
  }
}

export const getNotificationsService = async (params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
  const headers: any = {};
  if (params.workspaceType === 'RESTAURANT' && params.workspaceId) {
    headers["x-restaurant-id"] = params.workspaceId;
  }

  const response = await axiosClient.get(getNotificationUrl(params.workspaceType, params.workspaceId), {
    params: {
      type: params.type,
      page: params.page || 1,
      limit: params.limit || 20
    },
    headers
  });
  return response.data;
};

export const markAsReadService = async (id: string, workspaceType: string, workspaceId?: string) => {
  const response = await axiosClient.put(`${getNotificationUrl(workspaceType, workspaceId)}/${id}/read`, {});
  return response.data;
};

export const markAllAsReadService = async (workspaceType: string, workspaceId?: string) => {
  const headers: any = {};
  if (workspaceType === 'RESTAURANT' && workspaceId) {
    headers["x-restaurant-id"] = workspaceId;
  }

  const response = await axiosClient.put(`${getNotificationUrl(workspaceType, workspaceId)}/read-all`, {}, { headers });
  return response.data;
};

export const getUnreadCountService = async (workspaceType: string, workspaceId?: string) => {
  const headers: any = {};
  if (workspaceType === 'RESTAURANT' && workspaceId) {
    headers["x-restaurant-id"] = workspaceId;
  }

  const response = await axiosClient.get(`${getNotificationUrl(workspaceType, workspaceId)}/unread-count`, { headers });
  return response.data;
};

export const deleteNotificationService = async (id: string, workspaceType: string, workspaceId?: string) => {
  const headers: any = {};
  if (workspaceType === 'RESTAURANT' && workspaceId) {
    headers["x-restaurant-id"] = workspaceId;
  }

  const response = await axiosClient.delete(`${getNotificationUrl(workspaceType, workspaceId)}/${id}`, { 
    headers,
    params: { workspaceType } // Gửi lên BE để định danh chính xác bảng receipt nếu cần
  });
  return response.data;
};

