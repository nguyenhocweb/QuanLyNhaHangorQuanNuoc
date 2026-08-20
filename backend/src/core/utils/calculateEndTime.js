export const calculateEndTime = (startTime, hoursToAdd = 3) => {
    if (!startTime) return null;

    // Tách giờ và phút ra từ chuỗi
    const [hours, minutes] = startTime.split(":");
    
    // Ép kiểu sang số, cộng thêm giờ và dùng % 24 để xử lý qua ngày (VD: 22h + 3h = 1h sáng)
    const newHours = (parseInt(hours, 10) + hoursToAdd) % 24;
    
    // Format lại thành chuỗi, đảm bảo luôn có 2 chữ số (VD: "9" -> "09")
    const formattedHours = newHours.toString().padStart(2, "0");
    
    return `${formattedHours}:${minutes}`;
};