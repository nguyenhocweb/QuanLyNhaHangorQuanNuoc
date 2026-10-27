import { useQuery } from "@tanstack/react-query";
import { getAdminWebAuthorsService } from "../service/web_author_admin.get.service";

export const useGetAdminWebAuthors = () => {
  return useQuery({
    queryKey: ["ADMIN_WEB_AUTHORS"],
    queryFn: getAdminWebAuthorsService,
    staleTime: 60 * 1000
  });
};
