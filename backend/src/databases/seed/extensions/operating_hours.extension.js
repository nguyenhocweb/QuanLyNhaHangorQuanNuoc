import { operatingHoursData } from "../constants/operating_hours.data.js";
export const operatingHoursExtension = async (prisma) => {
    const restaurantId = await prisma.Restaurant.findMany({
        select: {
            id: true,
            name: true,
        }
    });
    const mapRestaurant = new Map(restaurantId.map(element => ([element.name, element.id])));
    console.log("creating operating Hours ..........");
    const result = await prisma.Operating_Hours.createMany({
        data: operatingHoursData.map(
            ({restaurantName,...e }) => (
                {
                  ...e,
                  restaurantId:mapRestaurant.get(restaurantName)
                }
            ))
    })
      console.log(`✅ Đã tạo thành công ${result.count} operating Hours    !`);
}