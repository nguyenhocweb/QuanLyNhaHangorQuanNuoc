import restaurantData from '../constants/restaurant.data.js';
export const restaurant_Extension = async(prisma)=>{
    // nơi lưu id của thương hiệu để gán cho nhà hàng
    const brandIds = await prisma.Brand.findMany({
        select: {
            id: true,
            name: true
        }
    });

    
    // xóa dữ liệu cũ
    console.log('creating restaurants...');

  
    // tạo dữ liệu
    const DataRest=restaurantData.map(({brandName,...restaurant}) => ({
            ...restaurant,
            brandId: brandIds.find(brand => brand.name === brandName)?.id 
        }))   ;
        
        
    const result = await prisma.Restaurant.createMany({
        data: DataRest   // Mảng dữ liệu
    });
    console.log(`✅ Đã tạo thành công ${result.count} Restaurants!`);
}