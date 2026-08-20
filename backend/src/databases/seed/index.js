// seed/index.js
import  { connectDB, disconnectDB,prisma } from '../init.mongodb.js'; // Import file DB chuẩn

import { roleExtension } from './extensions/role.extension.js';

import { users_Extension } from './extensions/user.extension.js';
import { Brand_Extension } from './extensions/brand.extension.js';
import { restaurant_Extension } from './extensions/restaurant.extension.js';
import { employment_Extension } from './extensions/employment.extension.js';
import { permission_extenion } from './extensions/permission.extension.js';
import {emp_vd_per_extension} from "./extensions/emloyment_vs_permission.extension.js";
import {operatingHoursExtension} from "./extensions/operating_hours.extension.js";
import {RestaurantAreas_Extension} from "./extensions/restaurant_areas.extension.js"
import {Special_Schedules_Extension} from "./extensions/special_schedules.extension.js";
import {table_Extension} from "./extensions/table.extension.js";
import {reservations_Extension} from  "./extensions/reservations.extension.js";
import {reservationTablesExtension} from "./extensions/reservationTables.extension.js"
import {notificationExtension} from "./extensions/notifications.extension.js"
import {reviewRestaurantExtension} from "./extensions/review_restaurant.extension.js";
import {reservationAuditLogsExtension} from "./extensions/reservation_audit_log.extension.js"
import {menusExtension} from "./extensions/menu.extension.js";
const runSeed = async () => {
    try {
        console.log('🌱 Starting Seed...');
        
        // 1. Kết nối
        await connectDB();
        //
        await prisma.permission_vs_Employment.deleteMany({});
        await prisma.permission.deleteMany({});
        await prisma.notifications.deleteMany({})
        await prisma.Reservation_Audit_Log.deleteMany();
        await prisma.reservation_Tables.deleteMany();
        await prisma.Review_Restaurant.deleteMany();
        await prisma.reservations.deleteMany();
        await prisma.employment.deleteMany();
        await prisma.operating_Hours.deleteMany();
        await prisma.special_Schedules.deleteMany();
        await prisma.tables.deleteMany();
        await prisma.restaurant_Areas.deleteMany();
        await prisma.MenuCategory.deleteMany();
        await prisma.Menu.deleteMany();
        await prisma.restaurant.deleteMany();
        await prisma.brand.deleteMany();
        await prisma.user.deleteMany();
        await prisma.role.deleteMany({})

       // tạo dữ liệu role admin và khách hàng trước để có id gán cho user
       await roleExtension(prisma);
       // tạo role cho nhân viên thương hiệu và nhà hàng
         // tạo dữ liệu user admin, khách hàng, nhân viên thương hiệu và nhà hàng
       await users_Extension(prisma);
        // tạo dữ liệu thương hiệu
        await Brand_Extension(prisma);
        // tạo dữ liệu nhà hàng
        await restaurant_Extension(prisma);
        // tạo nhân viên thương hiệu or nhà hàng
        await employment_Extension(prisma);
        // tạo nhiệm vụ làm j trong thương hiệu or nhà hàng
        await permission_extenion(prisma);
        // kết nối với nhau = table trung gian
        await emp_vd_per_extension(prisma);
        // tạo ngày h mở đóng cửa cho nhà hàng
        await operatingHoursExtension(prisma);
        // tạo ngày giờ đặt biệt đóng cửa
        await Special_Schedules_Extension(prisma);
        // tạo khu vực bàn ghế nhà hàng
        await RestaurantAreas_Extension(prisma);
        // tạo bàn ghê nhà hàng
        await table_Extension(prisma);
        // tạo đặt bàn nhà hàng
        await reservations_Extension(prisma);

        await reservationTablesExtension(prisma);
      
        await notificationExtension(prisma);

      //  await reviewRestaurantExtension(prisma);
        
        await reservationAuditLogsExtension(prisma);
        
        await menusExtension(prisma)

    } catch (error) {
        console.error('❌ Seed Failed:', error);
    } finally {
        await disconnectDB();
        process.exit(0); // Kết thúc tiến trình sau khi hoàn thành
        //process.exit(1); // Kết thúc tiến trình nếu có lỗi
    }
};

runSeed();