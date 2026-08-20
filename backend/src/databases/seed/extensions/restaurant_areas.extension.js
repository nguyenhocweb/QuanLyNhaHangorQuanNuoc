
import {restaurantAreasData} from "../constants/restaurant_areas.data.js"
export const RestaurantAreas_Extension= async(prisma)=>{
      const restaurantId=await prisma.Restaurant.findMany({
        select:{
            id:true,
            name:true,
        }
      });
      const mapRestaurant=new Map(restaurantId.map(element => ([element.name,element.id])));
      console.log("creating restaurant Areas ..........");
      const result=await prisma.Restaurant_Areas.createMany({
        data:restaurantAreasData.map(({restaurantName,...e})=>({
            ...e,
            restaurantId:mapRestaurant.get(restaurantName)
        }))
      });
       console.log(`✅ Đã tạo thành công ${result.count} Restaurants areas  !`);
      
}
