import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTagsService, createTagService, updateTagService, deleteTagService } from "../service/tag_service";
import toast from "react-hot-toast";

export const useTags = (params?: any) => {
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
      toast.success("Thêm mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTagService,
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTagService,
    onSuccess: () => {
      toast.success("Xóa thành công!");
      queryClient.invalidateQueries({ queryKey: ["Tags"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
