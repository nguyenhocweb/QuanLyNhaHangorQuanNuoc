import { reviewRestaurantData } from "../constants/review_restaurant.data.js";

export const reviewRestaurantExtension = async (prisma) => {
  console.log("Creating restaurant reviews...");

 
  


    const result = await prisma.review_Restaurant.createMany({
      data: reviewRestaurantData
    });
    console.log(`✅ Created ${result.count} restaurant reviews`);
 
};
