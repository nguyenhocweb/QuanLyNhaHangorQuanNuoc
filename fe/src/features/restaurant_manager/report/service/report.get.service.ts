import axiosClient from "@/src/core/api/axios-instance";

export const getRestaurantReportService = async (
  restaurantId: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  const params: any = { restaurantId };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axiosClient.get(`/restaurant-manager/report`, { params });
  return response.data;
};
