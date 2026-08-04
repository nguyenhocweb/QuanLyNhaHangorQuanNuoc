import { useQuery } from "@tanstack/react-query";
import { searchUserService, UserSearchResult } from "../service/user.search.service";

export const useSearchUser = (brandId: string, keyword: string) => {
  return useQuery<UserSearchResult[]>({
    queryKey: ["user_search", brandId, keyword],
    queryFn: () => searchUserService(brandId, keyword),
    enabled: !!brandId && keyword.trim().length > 0,
    staleTime: 60 * 1000,
  });
};
