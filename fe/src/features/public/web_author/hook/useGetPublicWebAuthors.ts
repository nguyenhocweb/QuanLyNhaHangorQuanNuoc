import { useQuery } from "@tanstack/react-query";
import { getPublicWebAuthorsService } from "../service/web_author.get.service";

export const useGetPublicWebAuthors = () => {
  return useQuery({
    queryKey: ["PUBLIC_WEB_AUTHORS"],
    queryFn: getPublicWebAuthorsService,
    staleTime: 60 * 1000
  });
};
