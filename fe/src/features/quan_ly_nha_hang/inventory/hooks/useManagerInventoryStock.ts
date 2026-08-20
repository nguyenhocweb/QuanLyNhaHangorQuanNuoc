import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getManagerStocksService, addManagerStockService, getManagerMasterItemsService } from "../services/inventory_stock.service";
import { toast } from "sonner";

export const useGetManagerStocks = (restaurantId: string, role: string, search?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['manager_stocks', restaurantId, role, search, page, limit],
    queryFn: async () => {
      const { data } = await getManagerStocksService(restaurantId, role, search, page, limit);
      return data;
    },
    enabled: !!restaurantId && !!role,
    staleTime: 60 * 1000
  });
};

export const useAddManagerStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addManagerStockService,
    onSuccess: (data: any) => {
      toast.success(data?.message || "Thêm mặt hàng thành công");
      queryClient.invalidateQueries({ queryKey: ['manager_stocks'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm mặt hàng");
    }
  });
};

export const useGetManagerMasterItems = (restaurantId: string, role: string) => {
  return useQuery({
    queryKey: ['manager_master_items', restaurantId, role],
    queryFn: async () => {
      const { data } = await getManagerMasterItemsService(restaurantId, role);
      return data;
    },
    enabled: !!restaurantId && !!role,
    staleTime: 60 * 1000
  });
};
