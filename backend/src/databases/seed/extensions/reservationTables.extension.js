import { reservationTablesData } from "../constants/reservationTables.data.js";
export const reservationTablesExtension = async (prisma) => {
    const reservationId = await prisma.reservations.findMany({
        where: {
            OR: reservationTablesData.map((e) => ({ confirmation_code: e.reservationCode }))
        },
        select: {
            id: true,
            confirmation_code:true,    
        }
    });
    const mapReservation=new Map(reservationId.map(e => ([e.confirmation_code,e.id])));
    const tableId = await prisma.tables.findMany({
        where: {
            OR: reservationTablesData.map((e) => ({ table_number: e.table_number }))
        },
        select: {
            id: true,
            table_number:true,
        }
    });
     const mapTable=new Map(tableId.map(e => ([e.table_number,e.id])));
    const result = await prisma.Reservation_Tables.createMany({
        data: reservationTablesData.map((e) => ({
            reservationId:mapReservation.get(e.reservationCode),
            tableId:mapTable.get(e.table_number)
        }))
    });
    console.log(`✅ Đã tạo thành công ${result.count} Reservation_Tables  !`);
}