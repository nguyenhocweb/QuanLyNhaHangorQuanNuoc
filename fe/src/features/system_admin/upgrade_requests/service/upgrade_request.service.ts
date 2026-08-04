import axiosClient from "@/src/core/api/axios-instance";
import { UpgradeRequestsResponse } from "../type/upgrade-request.type";

interface GetUpgradeRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const getAdminUpgradeRequests = async (params: GetUpgradeRequestsParams): Promise<UpgradeRequestsResponse> => {
  const response = await axiosClient.get("/system-admin/upgrade-request", { params });
  return response.data.metadata;
};

export const updateAdminUpgradeRequestStatus = async (id: string, status: "APPROVED" | "REJECTED"): Promise<any> => {
  const response = await axiosClient.patch(`/system-admin/upgrade-request/${id}/status`, { status });
  return response.data;
};
