import { getAreasAndTables, getTableAvailability } from "../table.repository/index.js";
import { calculateEndTime } from "../../../../core/utils/calculateEndTime.js";
export const getTablesByIdRestaurantService = async (idRestaurant, reservation_date, start_time, end_time) => {
   
   
   
    const [areasAndTables, bookedTableIds] = await Promise.all([
        getAreasAndTables(idRestaurant),
        getTableAvailability(idRestaurant, reservation_date, start_time, end_time??calculateEndTime(start_time))
    ]);

    if (!areasAndTables) return {code:404,mes:"không tìm thấy tài nguyên"};

    const unavailableIds = bookedTableIds || [];

    const result = areasAndTables.map(({ tabels, tables, ...areaInfo }) => ({
        ...areaInfo,
        // Dùng biến 'tabels' (bị sai chính tả) chứa data thật để map
        tables: tabels?.map((table) => ({
            ...table,
            isBooked: unavailableIds.includes(table.id)
        })) || []
    }));
     console.log(result,result.tabels);
     
    return {code:200,data:result};
};