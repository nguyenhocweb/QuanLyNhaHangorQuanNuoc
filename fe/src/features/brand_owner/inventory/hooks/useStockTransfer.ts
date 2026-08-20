import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getStockTransfersService,
  getStockTransferByIdService,
  createStockTransferService,
  updateStockTransferService,
  deleteStockTransferService
} from "../services/stock_transfer.service";

export const useGetStockTransfers = (brandId?: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['stockTransfers', brandId, page, limit],
    queryFn: () => getStockTransfersService(brandId!, page, limit),
    enabled: !!brandId,
    staleTime: 60 * 1000
  });
};

export const useGetStockTransferById = (brandId?: string, id?: string) => {
  return useQuery({
    queryKey: ['stockTransfer', brandId, id],
    queryFn: () => getStockTransferByIdService(brandId!, id!),
    enabled: !!brandId && !!id,
    staleTime: 60 * 1000
  });
};

export const useCreateStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, data }: { brandId: string, data: any }) => createStockTransferService(brandId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockTransfers', variables.brandId] });
      toast.success("Tạo phiếu chuyển kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tạo phiếu chuyển kho thất bại");
    }
  });
};

export const useUpdateStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id, data }: { brandId: string, id: string, data: any }) => updateStockTransferService(brandId, id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockTransfers', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['stockTransfer', variables.brandId, variables.id] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Cập nhật trạng thái thất bại");
    }
  });
};

export const useDeleteStockTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, id }: { brandId: string, id: string }) => deleteStockTransferService(brandId, id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockTransfers', variables.brandId] });
      toast.success("Xóa phiếu chuyển kho thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Xóa phiếu thất bại");
    }
  });
};
