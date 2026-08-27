import restaurantData from '../constants/restaurant.data.js';
export const restaurant_Extension = async(prisma)=>{
    const brandIds = await prisma.Brand.findMany({
        select: { id: true, name: true }
    });
    
    console.log('🚀 Creating Restaurants...');

    const DataRest = restaurantData.map(({
        brandName, 
        isActive,
        max_party_size, 
        booking_window_days, 
        cancellation_hours, 
        deposit_required, 
        deposit_amount,
        totalRating,
        averageRating,
        average_food_rating,
        average_service_rating,
        average_ambiance_rating,
        ...restaurant
    }) => ({
        ...restaurant,
        statusByAdmin: isActive,
        statusByBrand: isActive,
        brandId: brandIds.find(brand => brand.name === brandName)?.id,
        bookingConfig: {
            maxPartySize: max_party_size,
            bookingWindowDays: booking_window_days,
            cancellationHours: cancellation_hours,
            depositRequired: deposit_required,
            depositAmount: deposit_amount
        },
        ratingStats: {
            totalRating: totalRating,
            averageRating: averageRating,
            food: average_food_rating,
            service: average_service_rating,
            ambiance: average_ambiance_rating
        }
    }));
        
    const result = await prisma.Restaurant.createMany({
        data: DataRest
    });
    console.log(`✅ Đã tạo thành công ${result.count} Restaurants!`);
}