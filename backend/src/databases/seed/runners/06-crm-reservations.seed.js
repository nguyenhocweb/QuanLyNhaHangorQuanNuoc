import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 06: Khởi tạo CRM Khách Hàng Thân Thiết, Đặt Bàn (từ data/reservations.json),
 * Khuyến Mãi (từ data/promotions.json), Đánh Giá (từ data/reviews.json) & Sự Kiện (từ data/restaurant_events.json)
 */
export const seedCrmAndReservations = async () => {
    console.log("👉 [6/8] Khởi tạo CRM Hội Viên, Đặt Bàn, Đánh Giá, Voucher & Sự Kiện...");

    // 1. Đọc dữ liệu từ các file JSON
    const promosPath = new URL("../data/promotions.json", import.meta.url);
    const samplePromos = JSON.parse(fs.readFileSync(promosPath, "utf-8"));

    const reservationsPath = new URL("../data/reservations.json", import.meta.url);
    const sampleReservations = JSON.parse(fs.readFileSync(reservationsPath, "utf-8"));

    const reviewsPath = new URL("../data/reviews.json", import.meta.url);
    const sampleReviews = JSON.parse(fs.readFileSync(reviewsPath, "utf-8"));

    const eventsPath = new URL("../data/restaurant_events.json", import.meta.url);
    const sampleEvents = JSON.parse(fs.readFileSync(eventsPath, "utf-8"));

    // 2. Tải Master Entities
    const [allCustomers, allRestaurants, allTables, allBrands] = await Promise.all([
        prisma.user.findMany({
            where: {
                systemRole: { name: "Khách hàng" },
                user_name: { startsWith: "nguyen" }
            },
            take: 20
        }),
        prisma.restaurant.findMany({
            where: { statusByAdmin: "ACTIVE" },
            take: 10,
            include: { brand: true }
        }),
        prisma.tables.findMany({
            where: { status: "ACTIVE" }
        }),
        prisma.brand.findMany({
            where: { isActive: "ACTIVE" },
            take: 10
        })
    ]);

    const tiers = ["NEW", "BRONZE", "SILVER", "GOLD", "PLATINUM"];

    const tablesByRestId = new Map();
    for (const t of allTables) {
        if (!tablesByRestId.has(t.restaurantId)) {
            tablesByRestId.set(t.restaurantId, []);
        }
        tablesByRestId.get(t.restaurantId).push(t);
    }

    // 3. Khởi tạo Khuyến Mãi (Promotions từ JSON)
    const existingPromos = await prisma.promotion.findMany({ select: { code: true } });
    const existingPromoCodes = new Set(existingPromos.map(p => p.code));

    for (const pData of samplePromos) {
        if (!existingPromoCodes.has(pData.code)) {
            const promo = await prisma.promotion.create({
                data: {
                    code: pData.code,
                    description: pData.description,
                    discount_type: pData.discount_type,
                    discount_value: pData.discount_value,
                    min_order_value: pData.min_order_value,
                    max_discount: pData.max_discount,
                    valid_from: new Date(pData.valid_from),
                    valid_until: new Date(pData.valid_until),
                    usage_limit: pData.usage_limit,
                    used_count: pData.used_count,
                    isActive: pData.isActive
                }
            });

            // Gán Promotion cho một số User
            if (allCustomers.length > 0) {
                for (const cust of allCustomers.slice(0, 5)) {
                    await prisma.userPromotion.upsert({
                        where: {
                            userId_promotionId: {
                                userId: cust.id,
                                promotionId: promo.id
                            }
                        },
                        update: {},
                        create: {
                            userId: cust.id,
                            promotionId: promo.id,
                            isUsed: false
                        }
                    });
                }
            }
        }
    }

    let createdResCount = 0;
    let createdReviewCount = 0;

    // 4. Khởi tạo Khách hàng thân thiết & Lượt Đặt Bàn (từ data/reservations.json & data/reviews.json)
    for (let i = 0; i < allCustomers.length; i++) {
        const cust = allCustomers[i];
        const rest = allRestaurants[i % allRestaurants.length];
        const restTables = tablesByRestId.get(rest.id) || [];
        const table = restTables[i % restTables.length];
        const resTemplate = sampleReservations[i % sampleReservations.length];

        // A. Cấp bậc hội viên (RestaurantCustomer)
        const tier = tiers[i % tiers.length];
        const totalSpent = (i + 1) * 2500000;
        const loyaltyPoints = (i + 1) * 120;

        await prisma.restaurantCustomer.upsert({
            where: {
                restaurantId_userId: {
                    restaurantId: rest.id,
                    userId: cust.id
                }
            },
            update: {
                totalSpent: totalSpent,
                loyaltyPoints: loyaltyPoints,
                orderCount: i + 3,
                tier: tier
            },
            create: {
                restaurantId: rest.id,
                userId: cust.id,
                totalSpent: totalSpent,
                loyaltyPoints: loyaltyPoints,
                orderCount: i + 3,
                tier: tier
            }
        });

        // B. Lịch sử điểm thưởng (LoyaltyTransaction)
        await prisma.loyaltyTransaction.create({
            data: {
                userId: cust.id,
                restaurantId: rest.id,
                brandId: rest.brandId,
                points: 100.0,
                type: "EARN",
                isSuspicious: false,
                description: `Tích điểm hóa đơn dùng bữa tại ${rest.name}`
            }
        });

        // C. Lượt đặt bàn (Reservations từ JSON)
        const confirmationCode = `RES_${rest.id.slice(-4).toUpperCase()}_${Date.now()}_${i}`;
        const status = resTemplate.status;

        const reservation = await prisma.reservations.create({
            data: {
                confirmation_code: confirmationCode,
                restaurantId: rest.id,
                userId: cust.id,
                guest_name: cust.name || "Khách Hàng VIP",
                guest_phone: cust.sdt || "0903123456",
                guest_email: cust.email,
                reservation_date: new Date("2026-08-30T19:00:00.000Z"),
                start_time: "19:00",
                end_time: "21:30",
                party_size: resTemplate.party_size,
                status: status,
                source: resTemplate.source,
                occasion: resTemplate.occasion,
                special_requests: resTemplate.special_requests,
                deposit_paid: resTemplate.deposit_paid,
                deposit_amount: resTemplate.deposit_amount,
                confirmed_at: new Date("2026-08-30T10:00:00.000Z"),
                seated_at: status === "SEATED" || status === "COMPLETED" ? new Date("2026-08-30T19:05:00.000Z") : null,
                completed_at: status === "COMPLETED" ? new Date("2026-08-30T21:15:00.000Z") : null
            }
        });
        createdResCount++;

        // D. Phân bàn (Reservation_Tables)
        if (table) {
            await prisma.reservation_Tables.create({
                data: {
                    reservationId: reservation.id,
                    tableId: table.id
                }
            });
        }

        // E. Đánh giá nhà hàng (Review_Restaurant từ data/reviews.json)
        if (status === "COMPLETED") {
            const reviewTpl = sampleReviews[i % sampleReviews.length];
            await prisma.review_Restaurant.create({
                data: {
                    reservationId: reservation.id,
                    userId: cust.id,
                    restaurantId: rest.id,
                    overall_rating: reviewTpl.overall_rating,
                    food_rating: reviewTpl.food_rating,
                    service_rating: reviewTpl.service_rating,
                    ambiance_rating: reviewTpl.ambiance_rating,
                    comment: reviewTpl.comment,
                    is_public: true,
                    staff_response: reviewTpl.staff_response
                }
            });
            createdReviewCount++;
        }

        // F. Thông báo khách hàng (CustomerNotification)
        await prisma.customerNotification.create({
            data: {
                userId: cust.id,
                title: "Xác nhận đặt bàn thành công!",
                body: `Lịch đặt bàn tại ${rest.name} lúc 19:00 ngày 30/08 đã được nhân viên xác nhận. Mã đặt bàn: ${confirmationCode}`,
                type: "RESERVATION",
                referenceId: reservation.id,
                referenceType: "RESERVATION",
                isRead: true
            }
        });
    }

    // 5. Khởi tạo Sự kiện Nhà hàng (Restaurant_Event từ data/restaurant_events.json)
    for (const rest of allRestaurants.slice(0, 3)) {
        for (const evt of sampleEvents) {
            const existingEvt = await prisma.restaurant_Event.findFirst({
                where: { restaurantId: rest.id, title: evt.title }
            });
            if (!existingEvt) {
                await prisma.restaurant_Event.create({
                    data: {
                        restaurantId: rest.id,
                        title: evt.title,
                        description: evt.description,
                        image: evt.image,
                        startDate: new Date(evt.startDate),
                        endDate: new Date(evt.endDate),
                        isActive: evt.isActive
                    }
                });
            }
        }
    }

    console.log(`✅ Đã khởi tạo hoàn tất CRM Hội viên, ${createdResCount} Đặt bàn, ${createdReviewCount} Đánh giá & Sự kiện!`);
    return true;
};
