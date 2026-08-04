import { useQuery } from "@tanstack/react-query";
import { getAllAmenitiesService } from "../service/amenity.get.service";

export const useGetAllAmenities = () => {
    return useQuery({
        queryKey: ["getAllAmenities"],
        queryFn: async () => {
            const response = await getAllAmenitiesService();
            return response.data?.data || [];
        },
        staleTime: 60 * 1000,
    });
};
