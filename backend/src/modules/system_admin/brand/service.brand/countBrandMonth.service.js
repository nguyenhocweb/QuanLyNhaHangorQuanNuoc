import { countBrands } from "../repository.brand/index.js";
// 1. Lấy mốc thời gian hiện tại
const now = new Date();

// 2. Tính thời gian THÁNG NÀY (Current Month)
const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

// 3. Tính thời gian THÁNG TRƯỚC (Previous Month)
const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

export const CountBrantDasboard = async (where) => {
    const wherePreviousMonth = {
        ...where,
        createdAt: {
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonth,
        }

    }
    const whereCurrentMonth = {
        ...where,
        createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
        }
    }
    // 4. Lấy dữ liệu từ Database thông qua Repository
    // (Yêu cầu repo countBrands phải hỗ trợ lọc theo ngày tạo - createdAt)
    const [currentMonthCountBrand, previousMonthCountBrant] = await Promise.all([
        countBrands(whereCurrentMonth),
        countBrands(wherePreviousMonth)
    ])
    // 5. Tính toán % tăng trưởng (Growth Rate)
    let growthRate = 0;

    if (previousMonthCountBrant === 0) {
        // Tránh lỗi chia cho 0. Nếu tháng trước = 0 mà tháng này có data thì coi như tăng 100%
        growthRate = currentMonthCountBrand > 0 ? 100 : 0;
    } else {
        growthRate = ((currentMonthCountBrand - previousMonthCountBrant) / previousMonthCountBrant) * 100;
    }
    const roundedGrowthRate = Number(growthRate.toFixed(2));

    // 4. Xác định chiều hướng (trendType)
    let trend = 'neutral';
    if (roundedGrowthRate > 0) {
        trend = 'up';
    } else if (roundedGrowthRate < 0) {
        trend = 'down';
    }

    return {
        value: currentMonthCountBrand,
        trendPercentage: `${roundedGrowthRate}%`,
        trendType: trend,
        trendLabel: "tháng trước"
    };
}