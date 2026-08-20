import axiosClient from "@/src/core/api/axios-instance";

export const checkoutService = async (data: any) => {
  return axiosClient.post("/api/v1/restaurant-manager/cashier/checkout", data);
};
