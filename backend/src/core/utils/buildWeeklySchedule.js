import { addDays, isSameDay, format } from "date-fns";

export function mergeWeeklySchedules(operatingHours, specialSchedules, startOfWeekDate) {
  // 1. Khởi tạo mảng và gán day_name thành dạng số
  const weeklySchedules = Array.from({ length: 7 }).map((_, index) => {
    const targetDate = addDays(startOfWeekDate, index);
    const dayOfWeek = targetDate.getDay(); // Trả về số: 1 (T2) -> 6 (T7), 0 (CN)
    const targetMonth = targetDate.getMonth() + 1;
    const targetDayOfMonth = targetDate.getDate();

    const specialSchedule = specialSchedules.find((sp) => {
      if (sp.date && isSameDay(new Date(sp.date), targetDate)) return true;
      if (sp.is_recurring && sp.month === targetMonth && sp.day === targetDayOfMonth) return true;
      return false;
    });

    if (specialSchedule) {
      return {
        date: format(targetDate, "yyyy-MM-dd"),
        day_name: dayOfWeek, // <--- Trả về số nguyên
        is_open: specialSchedule.open_time !== null && specialSchedule.close_time !== null,
        open_time: specialSchedule.open_time,
        close_time: specialSchedule.close_time,
        is_special: true, // trùng ngày lễ
        
      };
    }

    const regularSchedule = operatingHours.find((op) => op.day_of_week === dayOfWeek);

    if (regularSchedule) {
      return {
        date: format(targetDate, "yyyy-MM-dd"),
        day_name: dayOfWeek, // <--- Trả về số nguyên
        is_open: regularSchedule.open_time !== null && regularSchedule.close_time !== null,
        open_time: regularSchedule.open_time,
        close_time: regularSchedule.close_time,
        is_special: false,
      };
    }

    return {
      date: format(targetDate, "yyyy-MM-dd"),
      day_name: dayOfWeek, // <--- Trả về số nguyên
      is_open: false,
      open_time: null,
      close_time: null,
      is_special: false, 
    };
  });

  // 2. Sắp xếp mảng theo thứ tự từ 1 (Thứ 2) -> 0 (Chủ nhật)
  return weeklySchedules.sort((a, b) => {
    // Đặt trọng số: CN (0) sẽ thành 7 để bị đẩy xuống cuối cùng, các ngày khác giữ nguyên số
    const weightA = a.day_name === 0 ? 7 : a.day_name;
    const weightB = b.day_name === 0 ? 7 : b.day_name;
    
    // Sắp xếp tăng dần theo trọng số (1, 2, 3, 4, 5, 6, 7)
    return weightA - weightB;
  });
}