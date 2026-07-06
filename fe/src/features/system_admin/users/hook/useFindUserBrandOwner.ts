import { useQuery } from "@tanstack/react-query";
import { FindUsersBrandOwnerService } from "../service/FindUsersBrandOwner_service";

export const useFindUserBrandOwner = (search?: string) => {
    return useQuery({
        queryKey: ["findUserBrandOwner", search],
        queryFn: () => FindUsersBrandOwnerService(search),
        staleTime:0,
        refetchOnWindowFocus: false,
    });
};
