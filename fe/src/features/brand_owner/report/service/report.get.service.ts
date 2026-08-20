import axiosClient from "@/src/core/api/axios-instance";

export const getRevenueReportService = async (
  brandId: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axiosClient.get(`/brand-owner/${brandId}/report`, { params });
  return response.data;
};
