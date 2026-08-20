import { reviewRestaurantData } from "../constants/review_restaurant.data.js";

export const reviewRestaurantExtension = async (prisma) => {
  console.log("Creating restaurant reviews...");

  // 1. Lấy reservations (Giữ nguyên logic của bạn)
  const reservations = await prisma.reservations.findMany({
    where: {
      OR: reviewRestaurantData.map(e => ({
        confirmation_code: e.reservationCode
      }))
    },
    select: { id: true, confirmation_code: true, userId: true }
  });

  const mapReservation = new Map(reservations.map(e => [e.confirmation_code, e]));

  // 2. Lấy restaurant (Kiểm tra lại tên model là Restaurant hay restaurant nhé)
  const restaurants = await prisma.restaurant.findMany({ 
    where: {
      OR: reviewRestaurantData.map(e => ({ name: e.restaurantName }))
    },
    select: { id: true, name: true }
  });

  const mapRestaurant = new Map(restaurants.map(e => [e.name, e.id]));

  // 3. Tạo review data với bước LỌC AN TOÀN
  const reviewData = reviewRestaurantData
    .map(e => {
      const reservation = mapReservation.get(e.reservationCode);
      const restaurantId = mapRestaurant.get(e.restaurantName);

      // KIỂM TRA: Nếu không tìm thấy Reservation hoặc Restaurant thì bỏ qua record này
      if (!reservation || !restaurantId) {
        console.warn(`⚠️ Bỏ qua review cho code ${e.reservationCode} vì không tìm thấy dữ liệu khớp.`);
        return null;
      }

      return {
        reservationId: reservation.id,
        userId: reservation.userId,
        restaurantId: restaurantId,
        overall_rating: e.overall_rating,
        food_rating: e.food_rating,
        service_rating: e.service_rating,
        ambiance_rating: e.ambiance_rating,
        comment: e.comment,
        is_public: e.is_public ?? true
      };
    })
    .filter(Boolean); // Loại bỏ các phần tử null

  // 4. Insert an toàn
  if (reviewData.length > 0) {
    const result = await prisma.review_Restaurant.createMany({
      data: reviewData
    });
    console.log(`✅ Created ${result.count} restaurant reviews`);
  } else {
    console.log("⚠️ No valid reviews to create.");
  }
};