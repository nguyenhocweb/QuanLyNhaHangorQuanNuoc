import { reservationTablesData } from "../constants/reservationTables.data.js";
export const reservationTablesExtension = async (prisma) => {
    
    const result = await prisma.Reservation_Tables.createMany({
        data: reservationTablesData
    });
    console.log(`✅ Đã tạo thành công ${result.count} Reservation_Tables  !`);
}
