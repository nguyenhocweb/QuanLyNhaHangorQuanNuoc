import { operatingHoursData } from "../constants/operating_hours.data.js";
export const operatingHoursExtension = async (prisma) => {
  
    const result = await prisma.Operating_Hours.createMany({
        data: operatingHoursData
                
    })
      console.log(`✅ Đã tạo thành công ${result.count} operating Hours    !`);
}
