import axiosClient from "@/src/core/api/axios-instance";

export const rejectStockCountService = async ({ id, role, reason }: { id: string, role: string, reason: string }) => {
  const prefix = role === "Quản lý nhà hàng" ? "restaurant-manager" : "staff";
  const res = await axiosClient.patch(`/${prefix}/inventory/stock_counts/${id}/reject`, { reason });
  return res.data;
};
