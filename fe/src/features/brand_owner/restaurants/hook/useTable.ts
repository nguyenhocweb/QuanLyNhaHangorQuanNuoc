import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTablesByAreaIdService, createTableService, updateTableService, deleteTableService, saveTableLayoutService } from "../service/table.service";
import { toast } from "sonner";

export const useGetTables = (areaId: string) => {
    return useQuery({
        queryKey: ['BrandTables', areaId],
        queryFn: () => getTablesByAreaIdService(areaId),
        staleTime: 60 * 1000,
        enabled: !!areaId
    });
};

export const useCreateTable = (areaId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTableService,
        onSuccess: () => {
            toast.success("Thêm bàn thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandTables', areaId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm bàn");
        }
    });
};

export const useUpdateTable = (areaId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateTableService,
        onSuccess: () => {
            toast.success("Cập nhật bàn thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandTables', areaId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
        }
    });
};

export const useDeleteTable = (areaId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTableService,
        onSuccess: () => {
            toast.success("Xóa bàn thành công");
            queryClient.invalidateQueries({ queryKey: ['BrandTables', areaId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa");
        }
    });
};

export const useSaveTableLayout = (areaId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveTableLayoutService,
        onSuccess: () => {
            toast.success("Đã lưu sơ đồ bàn");
            queryClient.invalidateQueries({ queryKey: ['BrandTables', areaId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Không thể lưu cấu hình");
        }
    });
};
