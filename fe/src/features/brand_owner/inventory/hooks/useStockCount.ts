import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  getStockCountsService, 
  getStockCountByIdService,
  createStockCountService, 
  updateStockCountService, 
  deleteStockCountService,
  approveStockCountService,
  rejectStockCountService
} from "../services/stock_count.service";

export const useGetStockCounts = (brandId?: string, restaurantId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['stockCounts', brandId, restaurantId, page, limit],
    queryFn: () => getStockCountsService(brandId!, restaurantId, page, limit),
    enabled: !!brandId,
    staleTime: 60 * 1000
  });
};

export const useGetStockCountById = (brandId?: string, id?: string) => {
  return useQuery({
    queryKey: ['stockCount', brandId, id],
    queryFn: () => getStockCountByIdService(brandId!, id!),
    enabled: !!brandId && !!id,
    staleTime: 60 * 1000
  });
};

export const useCreateStockCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: string, data: any }) => createStockCountService(brandId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockCounts', variables.brandId] });
      toast.success("Tạo phiếu kiểm kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tạo phiếu kiểm kho thất bại");
    }
  });
};

export const useUpdateStockCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id, data }: { brandId: string, id: string, data: any }) => updateStockCountService(brandId, id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockCounts', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['stockCount', variables.brandId, variables.id] });
      toast.success("Cập nhật phiếu kiểm kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Cập nhật phiếu kiểm kho thất bại");
    }
  });
};

export const useDeleteStockCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id }: { brandId: string, id: string }) => deleteStockCountService(brandId, id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockCounts', variables.brandId] });
      toast.success("Xóa phiếu kiểm kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa phiếu kiểm kho thất bại");
    }
  });
};

export const useApproveStockCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id, reason }: { brandId: string, id: string, reason: string }) => approveStockCountService(brandId, id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockCounts', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['stockCount', variables.brandId, variables.id] });
      toast.success("Duyệt phiếu kiểm kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Duyệt phiếu kiểm kho thất bại");
    }
  });
};

export const useRejectStockCount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id, reason }: { brandId: string, id: string, reason: string }) => rejectStockCountService(brandId, id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockCounts', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['stockCount', variables.brandId, variables.id] });
      toast.success("Từ chối phiếu kiểm kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Từ chối phiếu kiểm kho thất bại");
    }
  });
};
