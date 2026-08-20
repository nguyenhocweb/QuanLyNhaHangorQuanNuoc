import {category_restaurant_data} from "../constants/category_restaurant.data.js";

export const category_restaurant_extension = async (prisma) => {
    // create data category restaurant
        const result = await prisma.Category_Restaurant.createMany({
        data: category_restaurant_data
    });
    console.log(`✅ Đã tạo thành công ${result.count} Category Restaurant!`);   
};


