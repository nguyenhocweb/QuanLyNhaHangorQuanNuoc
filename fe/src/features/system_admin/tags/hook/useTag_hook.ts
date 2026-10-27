import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTagsService, createTagService, updateTagService, deleteTagService } from "../service/tag_service";
import { toast } from "sonner";

export const useTags = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ["Tags", params],
    queryFn: () => getTagsService(params),
    staleTime: 60 * 1000,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTagService,
    onSuccess: () => {
      toast.success("Thêm thẻ mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo thẻ");
    }
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTagService,
    onSuccess: () => {
      toast.success("Cập nhật thẻ thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật thẻ");
    }
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTagService,
    onSuccess: () => {
      toast.success("Đã xóa thẻ thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa thẻ");
    }
  });
};
