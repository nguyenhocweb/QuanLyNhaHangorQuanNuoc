import { useQuery } from "@tanstack/react-query";
import { DashboardStatService } from "../dashboard_service/dashboard_stat_service";
export const useDashboard_stat=()=>{
    return useQuery({
        queryKey:["Dashboard_stat_Admin"],
        queryFn:DashboardStatService,
        placeholderData:prev=>prev,
        staleTime:60*1000,
        refetchOnWindowFocus:false
    })
}