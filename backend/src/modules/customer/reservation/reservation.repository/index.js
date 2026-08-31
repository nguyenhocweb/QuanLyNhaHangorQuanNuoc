import { prisma } from "../../../../databases/init.mongodb.js";

const selectData = (data) => {
   const restaurantId = data.idRestaurant || data.restaurantId;
   const baseData = {
      restaurantId,
      userId: data.userId || null,
      confirmation_code: data.confirmation_code,
      guest_email: data.guest_email || data.email || null,
      guest_phone: data.guest_phone || data.phone || "",
      guest_name: data.guest_name || data.name || "Khách hàng",
      reservation_date: new Date(data.reservation_date).toISOString(),
      party_size: Number(data.party_size) || 1,
      start_time: data.start_time,
      end_time: data.end_time,
      occasion: data.occasion || null,
      special_requests: data.special_requests || null,
      status: "PENDING"
   };

   if (data.tables && Array.isArray(data.tables) && data.tables.length > 0) {
      return {
         ...baseData,
         reservation_tables: {
            create: data.tables.map(e => ({ tableId: typeof e === 'object' ? e.id : e }))
         }
      };
   }

   return baseData;
};

export const createReservation = async (data) => {
   return await prisma.reservations.create({
      data: selectData(data)
   });
};