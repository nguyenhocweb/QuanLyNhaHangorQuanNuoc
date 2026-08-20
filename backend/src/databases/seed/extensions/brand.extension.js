import brandData from '../constants/brand.data.js';
export const Brand_Extension = async(prisma)=>{
    // xóa dữ liệu cũ
    console.log('creating brands...');
  
    // tạo dữ liệu
    const result = await prisma.Brand.createMany({
        data: brandData,       // Mảng dữ liệu
    });
    console.log(`✅ Đã tạo thành công ${result.count} Brands!`);
}