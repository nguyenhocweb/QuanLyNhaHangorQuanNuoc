import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenitiesService, createAmenityService, updateAmenityService, deleteAmenityService } from "../service/amenity_service";
import { toast } from "sonner";

export const useAmenities = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ["Amenities", params],
    queryFn: () => getAmenitiesService(params),
    staleTime: 60 * 1000,
  });
};

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAmenityService,
    onSuccess: () => {
      toast.success("Thêm tiện ích mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi thêm tiện ích");
    }
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAmenityService,
    onSuccess: () => {
      toast.success("Cập nhật tiện ích thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmenityService,
    onSuccess: () => {
      toast.success("Đã xóa tiện ích thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi xóa tiện ích");
    }
  });
};
