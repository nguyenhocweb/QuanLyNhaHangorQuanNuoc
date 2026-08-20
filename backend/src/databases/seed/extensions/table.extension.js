import {tablesData} from "../constants/tables.data.js"
export const table_Extension=async(prisma)=>{
    
      
    console.log('🚀 Creating Table...');
    const result=await prisma.Tables.createMany({
        data: tablesData
    });
    console.log(`✅ Đã tạo thành công ${ result.count} table!`);
}
