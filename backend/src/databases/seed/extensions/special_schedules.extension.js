import {specialSchedulesData} from "../constants/special_schedules.data.js";
export const Special_Schedules_Extension=async (prisma)=>{
   
    console.log("creating Special Schedules ..........");
    const result =await prisma.Special_Schedules.createMany({
        data:specialSchedulesData
    })
     console.log(`✅ Đã tạo thành công ${result.count} Special Schedules  !`);
}
