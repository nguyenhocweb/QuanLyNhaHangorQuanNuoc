export const calculateWeightedScore = (totalRating, averageRating) => {
    // THAM SỐ CẤU HÌNH (Có thể điều chỉnh tùy quy mô hệ thống)
    const m = 10;   // Số lượng đánh giá tối thiểu để một Brand được coi là "đáng tin"
    const C = 3.5;  // Điểm trung bình mặc định của toàn bộ hệ thống (thường từ 3.0 - 4.0)

    // Nếu chưa có đánh giá nào, trả về điểm trung bình hệ thống
    if (!totalRating || totalRating === 0) {
        return C;
    }

    // Công thức: W = (v / (v + m)) * R + (m / (v + m)) * C
    const v = totalRating;
    const R = averageRating;

    const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C;

    // Trả về kết quả làm tròn 2 chữ số thập phân
    return Math.round(weightedScore * 100) / 100;
};