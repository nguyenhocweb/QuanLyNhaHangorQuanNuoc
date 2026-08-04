import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenitiesService, createAmenityService, updateAmenityService, deleteAmenityService } from "../service/amenity_service";
import toast from "react-hot-toast";

export const useAmenities = (params?: any) => {
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
      toast.success("Thêm mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAmenityService,
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmenityService,
    onSuccess: () => {
      toast.success("Xóa thành công!");
      queryClient.invalidateQueries({ queryKey: ["Amenities"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    }
  });
};
