// seed/index.js
import { connectDB, disconnectDB, prisma } from '../init.mongodb.js';

import { users_Extension } from './extensions/user.extension.js';
import { Brand_Extension } from './extensions/brand.extension.js';
import { restaurant_Extension } from './extensions/restaurant.extension.js';
import { employment_Extension } from './extensions/employment.extension.js';
import { emp_vd_per_extension } from "./extensions/emloyment_vs_permission.extension.js";
import { operatingHoursExtension } from "./extensions/operating_hours.extension.js";
import { RestaurantAreas_Extension } from "./extensions/restaurant_areas.extension.js"
import { Special_Schedules_Extension } from "./extensions/special_schedules.extension.js";
import { table_Extension } from "./extensions/table.extension.js";
import { reservations_Extension } from  "./extensions/reservations.extension.js";
import { reservationTablesExtension } from "./extensions/reservationTables.extension.js"
import { notificationExtension } from "./extensions/notifications.extension.js"
import { reviewRestaurantExtension } from "./extensions/review_restaurant.extension.js";
import { reservationAuditLogsExtension } from "./extensions/reservation_audit_log.extension.js"
import { menusExtension } from "./extensions/menu.extension.js";

const runSeed = async () => {
    try {
        console.log('🌱 Starting Mock Data Seed...');
        
        await connectDB();
        
        console.log('🗑️ Cleaning old mock data (Skipping Mandatory Data)...');
        
        await prisma.permission_vs_Employment.deleteMany({});
        
        await prisma.notifications.deleteMany({});
        await prisma.Reservation_Audit_Log.deleteMany({});
        await prisma.reservation_Tables.deleteMany({});
        await prisma.Review_Restaurant.deleteMany({});
        await prisma.reservations.deleteMany({});
        
        await prisma.employment.deleteMany({});
        await prisma.operating_Hours.deleteMany({});
        await prisma.special_Schedules.deleteMany({});
        await prisma.tables.deleteMany({});
        await prisma.restaurant_Areas.deleteMany({});
        await prisma.MenuCategory.deleteMany({});
        await prisma.Menu.deleteMany({});
        
        await prisma.invoice.deleteMany({});
        await prisma.brandSubscriptionTransaction.deleteMany({});
        await prisma.brandSubscription.deleteMany({});
        
        await prisma.brandRevenue.deleteMany({});
        await prisma.restaurantRevenue.deleteMany({});
        await prisma.restaurant.deleteMany({});
        await prisma.brand.deleteMany({});
        
        // Delete all users EXCEPT the mandatory Admin user
        await prisma.user.deleteMany({
            where: {
                email: { not: "admin01@example.com" }
            }
        });
        // await prisma.role.deleteMany({}); // MANDATORY DATA (SystemRole / WorkspaceRole)

        console.log('🚀 Seeding Mock Data...');
        
        await users_Extension(prisma);
        await Brand_Extension(prisma);
        await restaurant_Extension(prisma);
        await employment_Extension(prisma);
        await emp_vd_per_extension(prisma);
        
        await operatingHoursExtension(prisma);
        await Special_Schedules_Extension(prisma);
        await RestaurantAreas_Extension(prisma);
        await table_Extension(prisma);
        
        await reservations_Extension(prisma);
        await reservationTablesExtension(prisma);
        await notificationExtension(prisma);
        
        // await reviewRestaurantExtension(prisma);
        await reservationAuditLogsExtension(prisma);
        await menusExtension(prisma);

        console.log('✅ Hoàn thành quá trình Seed Mock Data!');
    } catch (error) {
        console.error('❌ Seed Failed:', error);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
};

runSeed();