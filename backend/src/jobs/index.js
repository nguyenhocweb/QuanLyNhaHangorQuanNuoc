// công việc server tự dộng chạy mỗi ngày vào mấy h
import cron from "node-cron";
import { RestaurantJob } from "./restaurant.job.js";
export const initCronJob = () => {
    cron.schedule(
        "0 0 * * *", // giờ lịch này chạy
        // hàm chạy việc j
        async () => {
            await RestaurantJob();
        }
    )
}
// ┌───────── phút (0 - 59)
// │ ┌──────── giờ (0 - 23)
// │ │ ┌────── ngày trong tháng (1 - 31)
// │ │ │ ┌──── tháng (1 - 12)
// │ │ │ │ ┌── ngày trong tuần (0 - 7) (0 hoặc 7 = Chủ nhật)
// │ │ │ │ │
// * * * * *