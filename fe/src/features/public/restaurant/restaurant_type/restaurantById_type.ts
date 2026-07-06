// 1. Type cho từng ngày trong tuần
export interface DailySchedule {
    date: string;          // Định dạng YYYY-MM-DD
    day_name: number;      // 1: Thứ 2, 2: Thứ 3,..., 6: Thứ 7, 0: Chủ nhật
    is_open: boolean;      // true: mở cửa, false: đóng cửa
    open_time: string | null;  // Giờ mở cửa (VD: "10:00"). Dùng | null đề phòng ngày nghỉ
    close_time: string | null; // Giờ đóng cửa (VD: "22:00"). Dùng | null đề phòng ngày nghỉ
    is_special: boolean;   // cờ báo hiệu ngày lễ/đổi giờ đặc biệt
}

// 2. Type tổng thể cho dữ liệu nhà hàng
export interface RestaurantDetailResponse {
    id: string;
    name: string;
    description: string;
    imageMain: string;
    images: string[];
    address: string;
    phone_contact: string;
    email_contact: string;
    brandName:string,
    city:string,
    timeWeek: DailySchedule[]; // Gọi lại interface ở trên
}