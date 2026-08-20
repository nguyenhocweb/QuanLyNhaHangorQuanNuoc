import {specialSchedulesData} from "../constants/special_schedules.data.js";
export const Special_Schedules_Extension=async (prisma)=>{
     const restaurantId = await prisma.Restaurant.findMany({
        select: {
            id: true,
            name: true,
        }
    });
    const mapRestaurant = new Map(restaurantId.map(element => ([element.name, element.id])));
    console.log("creating Special Schedules ..........");
    const result =await prisma.Special_Schedules.createMany({
        data:specialSchedulesData.map(
            ({restaurantName,...e})=>
                ({
                    ...e,
                     restaurantId:mapRestaurant.get(restaurantName)
                })
        )
    })
     console.log(`✅ Đã tạo thành công ${result.count} Special Schedules  !`);
}