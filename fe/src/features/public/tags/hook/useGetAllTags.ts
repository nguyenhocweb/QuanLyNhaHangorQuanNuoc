import { useQuery } from "@tanstack/react-query";
import { getAllTagsService } from "../service/tag.get.service";

export const useGetAllTags = () => {
    return useQuery({
        queryKey: ["getAllTags"],
        queryFn: async () => {
            const response = await getAllTagsService();
            return response.data?.data || [];
        },
        staleTime: 60 * 1000,
    });
};
