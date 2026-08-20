import { prisma } from "../../../../databases/init.mongodb.js";
import { v4 as uuidv4 } from 'uuid'; // cần để tạo confirmation_code

export const createReservationRepo = async (restaurantId, staffId, data) => {
    // Nếu end_time không có, mặc định cộng thêm 2 tiếng từ start_time (tuỳ logic, ta có thể tạm set là start_time + 2h)
    let end_time = data.end_time;
    if (!end_time) {
        const [hours, minutes] = data.start_time.split(':');
        const endHour = (parseInt(hours) + 2) % 24;
        end_time = `${endHour.toString().padStart(2, '0')}:${minutes}`;
    }

    return prisma.reservations.create({
        data: {
            restaurantId,
            created_by_staff_id: staffId,
            confirmation_code: uuidv4().substring(0, 8).toUpperCase(),
            guest_name: data.guest_name,
            guest_phone: data.guest_phone,
            guest_email: data.guest_email || null,
            reservation_date: new Date(data.reservation_date),
            start_time: data.start_time,
            end_time: end_time,
            party_size: data.party_size,
            source: data.source,
            occasion: data.occasion,
            special_requests: data.special_requests || null,
            internal_notes: data.internal_notes || null,
            status: "CONFIRMED",
            ...(data.table_ids && data.table_ids.length > 0 && {
                reservation_tables: {
                    create: data.table_ids.map(tableId => ({
                        tableId,
                        assigned_by_staff_id: staffId
                    }))
                }
            })
        }
    });
};
