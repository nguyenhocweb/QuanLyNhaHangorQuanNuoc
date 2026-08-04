import { prisma } from './src/databases/init.mongodb.js';

async function seed() {
    const restaurantId = "b5ec3cff266098d6e850fac0";

    // Clear old data
    await prisma.tables.deleteMany({ where: { restaurantId } });
    await prisma.restaurant_Areas.deleteMany({ where: { restaurantId } });

    // 1. Get or Create Area
    let area = await prisma.restaurant_Areas.create({
            data: {
                restaurantId,
                name: "Tầng 1 (Sảnh Chính)",
                floor_number: 1,
                is_outdoor: false,
                width: 1200,
                height: 800,
                obstacles: [
                    { type: 'WALL', x: 0, y: 0, width: 1200, height: 20 },
                    { type: 'WALL', x: 0, y: 780, width: 1200, height: 20 },
                    { type: 'WALL', x: 0, y: 0, width: 20, height: 800 },
                    { type: 'WALL', x: 1180, y: 0, width: 20, height: 800 },
                    { type: 'DOOR', x: 550, y: 780, width: 100, height: 20 },
                    { type: 'PLANT', x: 50, y: 50, width: 40, height: 40 }
                ]
            }
        });
        console.log("Created Area 1:", area.id);

        let area2 = await prisma.restaurant_Areas.create({
            data: {
                restaurantId,
                name: "Tầng 2 (VIP)",
                floor_number: 2,
                is_outdoor: false,
                width: 1200,
                height: 800,
                obstacles: [
                    { type: 'WALL', x: 0, y: 0, width: 1200, height: 20 },
                    { type: 'WALL', x: 0, y: 780, width: 1200, height: 20 },
                    { type: 'WALL', x: 0, y: 0, width: 20, height: 800 },
                    { type: 'WALL', x: 1180, y: 0, width: 20, height: 800 }
                ]
            }
        });
        console.log("Created Area 2:", area2.id);

        // Define tables for both areas
        const positions = [
            // Tầng 1
            { areaId: area.id, x: 100, y: 100, shape: 'ROUND', w: 80, h: 80, cap: 2, t: 'T1', isVip: false },
            { areaId: area.id, x: 300, y: 100, shape: 'ROUND', w: 80, h: 80, cap: 2, t: 'T2', isVip: false },
            { areaId: area.id, x: 500, y: 100, shape: 'RECT', w: 120, h: 80, cap: 4, t: 'T3', isVip: false },
            { areaId: area.id, x: 700, y: 100, shape: 'RECT', w: 120, h: 80, cap: 4, t: 'T4', isVip: false },
            { areaId: area.id, x: 100, y: 300, shape: 'SQUARE', w: 80, h: 80, cap: 2, t: 'T5', isVip: false },
            { areaId: area.id, x: 300, y: 300, shape: 'SQUARE', w: 80, h: 80, cap: 2, t: 'T6', isVip: false },
            { areaId: area.id, x: 100, y: 500, shape: 'RECT', w: 120, h: 80, cap: 4, t: 'T7', isVip: false },
            { areaId: area.id, x: 300, y: 500, shape: 'RECT', w: 120, h: 80, cap: 4, t: 'T8', isVip: false },
            // Tầng 2
            { areaId: area2.id, x: 200, y: 200, shape: 'ROUND', w: 100, h: 100, cap: 6, t: 'VIP1', isVip: true },
            { areaId: area2.id, x: 500, y: 200, shape: 'ROUND', w: 100, h: 100, cap: 6, t: 'VIP2', isVip: true },
            { areaId: area2.id, x: 800, y: 200, shape: 'ROUND', w: 100, h: 100, cap: 6, t: 'VIP3', isVip: true }
        ];

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const isCleaning = i === 3; // T4 will be CLEANING
            
            const newTable = await prisma.tables.create({
                data: {
                    restaurantId,
                    areaId: pos.areaId,
                    table_number: pos.t,
                    min_capacity: 1,
                    max_capacity: pos.cap,
                    shape: pos.shape,
                    pos_x: pos.x,
                    pos_y: pos.y,
                    width: pos.w,
                    height: pos.h,
                    rotation: 0,
                    status: isCleaning ? 'CLEANING' : 'ACTIVE',
                    is_vip: pos.isVip,
                    table_type: pos.isVip ? 'VIP' : 'STANDARD',
                    qr_code: "QR_MOCK_" + Date.now() + "_" + pos.t
                }
            });

            // Add Maintenance for T1
            if (i === 0) {
                await prisma.table_Maintenance_Schedules.create({
                    data: {
                        restaurantId,
                        tableIds: [newTable.id],
                        start_time: new Date(Date.now() - 3600000), // 1 hr ago
                        end_time: new Date(Date.now() + 86400000 * 10), // 10 days later
                        reason: "Hỏng chân bàn",
                        status: "IN_PROGRESS"
                    }
                });
            }

            // Add SEATED Reservation for T2
            if (i === 1) {
                const res = await prisma.reservation.create({
                    data: {
                        restaurantId,
                        userId: "user_mock",
                        guest_name: "Anh VIP",
                        guest_phone: "0900000000",
                        party_size: 2,
                        reservation_date: new Date(),
                        start_time: new Date(Date.now() - 1800000), // 30 mins ago
                        end_time: new Date(Date.now() + 3600000), // 1 hr later
                        status: "SEATED",
                        source: "WALK_IN",
                        is_prepaid: false
                    }
                });
                await prisma.reservation_Tables.create({
                    data: {
                        reservationId: res.id,
                        tableId: newTable.id
                    }
                });
            }

            // Add RESERVED (CONFIRMED) Reservation for T3
            if (i === 2) {
                const res = await prisma.reservation.create({
                    data: {
                        restaurantId,
                        userId: "user_mock2",
                        guest_name: "Chị Hằng",
                        guest_phone: "0900000001",
                        party_size: 4,
                        reservation_date: new Date(),
                        start_time: new Date(Date.now() - 1800000), // 30 mins ago
                        end_time: new Date(Date.now() + 3600000), // 1 hr later
                        status: "CONFIRMED",
                        source: "WEB",
                        is_prepaid: false
                    }
                });
                await prisma.reservation_Tables.create({
                    data: {
                        reservationId: res.id,
                        tableId: newTable.id
                    }
                });
            }
        }
        console.log("Created 11 tables across 2 areas.");

    console.log("Seed completed!");
    process.exit(0);
}

seed().catch(console.error);
