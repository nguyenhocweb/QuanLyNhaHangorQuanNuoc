import { useQuery } from "@tanstack/react-query";
import { getMyBrandService } from "../service/my_brand.get.service";

export const useGetMyBrand = () => {
    return useQuery({
        queryKey: ["myBrand"],
        queryFn: async () => {
            const res = await getMyBrandService();
            return res.data.data;
        },
        staleTime: 60 * 1000,
    });
};
