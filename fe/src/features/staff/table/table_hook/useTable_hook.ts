import { useQuery } from "@tanstack/react-query";
import { getTableService } from "../table_service/getTable_service";
import { getTableRequest } from "../table_type/getTable_type";
export const useTableHook = (
    {
        idRestaurant,
        reservation_date,
        start_time,
        end_time
    }: getTableRequest) => {

    return useQuery({
        queryKey: ["tables", { idRestaurant, reservation_date, start_time, end_time }],
        queryFn: () => getTableService({idRestaurant,reservation_date,start_time,end_time}),
        placeholderData: (pev) => pev,
        staleTime: 1000 * 60,   // cache 1 phút hết 1 phút gọi lại lệnh mới gọi lại api
        //refetchInterval: 60 *1000, // mõi 1 phút tự động gọi api
        refetchOnWindowFocus: false, // đổi tab thì có gọi api lại không true có
    })

}