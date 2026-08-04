import { useQuery } from "@tanstack/react-query";
import { getPublicCategoriesService } from "../service/category.get.service";

export const useGetPublicCategories = () => {
    return useQuery({
        queryKey: ["public_categories"],
        queryFn: getPublicCategoriesService,
        staleTime: 60 * 1000, // 1 minute as per architectural rules
    });
};
