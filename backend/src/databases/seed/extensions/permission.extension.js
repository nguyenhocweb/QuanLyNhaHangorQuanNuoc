import { permission_data } from "../constants/permission.data.js";
export const permission_extenion=async(prisma)=>{
      // xóa dữu liệu cũ
      
      console.log('creating Permission...');
      const result=await prisma.Permission.createMany({
        data:permission_data
      }) 
       console.log(`✅ Đã tạo thành công ${result.count} Permisson!`);
}