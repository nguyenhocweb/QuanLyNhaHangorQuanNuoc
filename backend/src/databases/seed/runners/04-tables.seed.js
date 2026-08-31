import fs from "fs";
import { prisma } from "../../init.mongodb.js";

/**
 * Runner 04: Khởi tạo Bàn Ăn (Tables), Sơ Đồ Bàn (Layout POS) & Lịch Bảo Trì (từ data/tables.json)
 */
export const seedTables = async () => {
    console.log("👉 [4/8] Khởi tạo Bàn ăn & Sơ đồ mặt bằng (từ data/tables.json)...");

    // 1. Đọc template bàn từ data/tables.json
    const tablesPath = new URL("../data/tables.json", import.meta.url);
    const tablesTemplate = JSON.parse(fs.readFileSync(tablesPath, "utf-8"));

    // 2. Tải danh sách Nhà hàng & Khu vực hiện có
    const [restaurants, areas, existingTables] = await Promise.all([
        prisma.restaurant.findMany({
            select: { id: true, slug: true, name: true }
        }),
        prisma.restaurant_Areas.findMany({
            select: { id: true, restaurantId: true, name: true, floor_number: true }
        }),
        prisma.tables.findMany({
            select: { id: true, restaurantId: true, table_number: true }
        })
    ]);

    const existingTableSet = new Set(existingTables.map(t => `${t.restaurantId}_${t.table_number}`));
    const tablesToCreate = [];

    // Gom nhóm Areas theo restaurantId
    const areasByRestId = new Map();
    for (const area of areas) {
        if (!areasByRestId.has(area.restaurantId)) {
            areasByRestId.set(area.restaurantId, []);
        }
        areasByRestId.get(area.restaurantId).push(area);
    }

    for (const rest of restaurants) {
        const restAreas = areasByRestId.get(rest.id) || [];
        
        for (const area of restAreas) {
            let tpl = tablesTemplate.area_table_templates[0];

            if (area.name.includes("VIP") || area.floor_number === 2) {
                tpl = tablesTemplate.area_table_templates[1];
            } else if (area.name.includes("Rooftop") || area.floor_number === 3) {
                tpl = tablesTemplate.area_table_templates[2];
            }

            for (let i = 1; i <= tpl.count; i++) {
                const tableNumber = `${tpl.prefix}${String(i).padStart(2, "0")}`;
                const tableKey = `${rest.id}_${tableNumber}`;

                if (!existingTableSet.has(tableKey)) {
                    const isMaintenance = tpl.prefix === "T" && i === 5 && rest.id.charCodeAt(0) % 2 === 0;

                    tablesToCreate.push({
                        restaurantId: rest.id,
                        areaId: area.id,
                        table_number: tableNumber,
                        min_capacity: tpl.min_capacity,
                        max_capacity: tpl.max_capacity,
                        shape: tpl.shape,
                        is_combinable: tpl.is_combinable,
                        pos_x: (i % 3) * 120.0 + 50.0,
                        pos_y: Math.floor((i - 1) / 3) * 120.0 + 50.0,
                        status: isMaintenance ? "MAINTENANCE" : "ACTIVE",
                        qr_code: `QR_${rest.slug}_${area.floor_number}_${tableNumber}`
                    });
                    existingTableSet.add(tableKey);
                }
            }
        }
    }

    if (tablesToCreate.length > 0) {
        await prisma.tables.createMany({
            data: tablesToCreate
        });
    }

    // Khởi tạo Lịch bảo trì (Table_Maintenance_Schedules)
    const maintenanceTables = await prisma.tables.findMany({
        where: { status: "MAINTENANCE" },
        select: { id: true, restaurantId: true, table_number: true }
    });

    const existingSchedules = await prisma.table_Maintenance_Schedules.findMany({
        select: { id: true, restaurantId: true }
    });
    const scheduleRestSet = new Set(existingSchedules.map(s => s.restaurantId));

    const schedulesToCreate = [];
    for (const table of maintenanceTables) {
        if (!scheduleRestSet.has(table.restaurantId)) {
            const reason = tablesTemplate.maintenance_reasons[0];
            schedulesToCreate.push({
                restaurantId: table.restaurantId,
                tableIds: [table.id],
                start_time: new Date("2026-08-30T08:00:00.000Z"),
                end_time: new Date("2026-09-05T18:00:00.000Z"),
                reason: `${reason} (Bàn ${table.table_number})`,
                status: "IN_PROGRESS"
            });
            scheduleRestSet.add(table.restaurantId);
        }
    }

    if (schedulesToCreate.length > 0) {
        for (const s of schedulesToCreate) {
            await prisma.table_Maintenance_Schedules.create({
                data: s
            });
        }
    }

    console.log(`✅ Đã khởi tạo hoàn tất Bàn ăn và Lịch bảo trì từ data/tables.json!`);
    return true;
};
