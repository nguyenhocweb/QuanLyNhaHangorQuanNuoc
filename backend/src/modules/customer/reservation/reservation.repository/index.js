import { prisma } from "../../../../databases/init.mongodb.js";
import { toISODateOnly } from "../../../../core/utils/displayDateTime.js";
const selectData = (data) => {
   if (data.tables) {
      return {
         restaurantId: data.idRestaurant,
         userId: data.userId,
         confirmation_code:data.confirmation_code,
         guest_email: data.guest_email ?? null,
         guest_phone: data.guest_phone,
         guest_name: data.guest_name,
         reservation_date:new Date(data.reservation_date).toISOString() ,
         party_size: data.party_size,
         start_time: data.start_time,
         end_time: data.end_time,
         occasion: data.occasion,
         special_requests: data.special_requests ?? null,
         reservation_tables: {
            create: data.tables.map(e => ({ tableId: e }))
         }
      }
   } else {
      return {
         restaurantId: data.idRestaurant,
         userId: data.userId,
         confirmation_code:data.confirmation_code,
         guest_email: data.guest_email ?? null,
         guest_phone: data.guest_phone,
         guest_name: data.guest_name,
         reservation_date: new Date(data.reservation_date).toISOString() ,
         party_size: data.party_size,
         start_time: data.start_time,
         end_time: data.end_time,
         occasion: data.occasion,
         special_requests: data.special_requests ?? null,
      }
   }
}
export const createReservation = async (data) => {
   return await prisma.reservations.create({
      data:selectData(data)
   })
} 