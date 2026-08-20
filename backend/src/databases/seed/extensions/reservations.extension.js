import {reservationsData} from "../constants/reservations.data.js";
export const  reservations_Extension=async (prisma)=>{
   
          const result=await prisma.reservations.createMany({
            data: reservationsData
          });
           console.log(`✅ Đã tạo thành công ${result.count} reservations  !`);
}
