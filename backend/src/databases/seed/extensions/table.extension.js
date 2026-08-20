import {tablesData} from "../constants/tables.data.js"
export const table_Extension=async(prisma)=>{
     const restaurantId=await prisma.Restaurant.findMany({
        select:{
            id:true,
            name:true,
        }
      });
       const mapRestaurant=new Map(restaurantId.map(element => ([element.name,element.id])));
      const restaurantAreasId=await prisma.Restaurant_Areas.findMany({
         select:{
            id:true,
            name:true,
            restaurantId:true,
        }
      })
      const mapRestaurantAreas=new Map(restaurantAreasId.map(
        e=>
        (
            [
                `${e.name}_${e.restaurantId}`,
                e.id
            ]

        )
    ))
    console.log('🚀 Creating Table...');
    const result=await prisma.Tables.createMany({
        data:tablesData.map(
            ({restaurantName,areaName,...e})=>(
             {
               ...e,
               restaurantId:mapRestaurant.get(restaurantName),
               areaId:mapRestaurantAreas.get(`${areaName}_${mapRestaurant.get(restaurantName)}`)
             }
            )
        )
    });
    console.log(`✅ Đã tạo thành công ${ result.count} table!`);
}