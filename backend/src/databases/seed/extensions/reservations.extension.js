import {reservationsData} from "../constants/reservations.data.js";
export const  reservations_Extension=async (prisma)=>{
    const restaurantId=await prisma.Restaurant.findMany({
            select:{
                id:true,
                name:true,
            }
          });
          const mapRestaurant=new Map(restaurantId.map(element => ([element.name,element.id])));
          console.log("creating reservations ..........");
          const result=await prisma.reservations.createMany({
            data:reservationsData.map(({restaurantName,...e})=>({
                ...e,
                restaurantId:mapRestaurant.get(restaurantName)
            }))
          });
           console.log(`✅ Đã tạo thành công ${result.count} reservations  !`);
}