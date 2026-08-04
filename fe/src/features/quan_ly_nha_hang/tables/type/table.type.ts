export enum TableOperationalStatus {
    AVAILABLE = "AVAILABLE", // Bàn trống
    IN_USE = "IN_USE",       // Đang phục vụ (Có hóa đơn chưa thanh toán)
    RESERVED = "RESERVED",   // Đã đặt trước (Sắp tới giờ)
    CLEANING = "CLEANING",   // Đợi dọn dẹp (Đã thanh toán nhưng chưa dọn xong)
    MAINTENANCE = "MAINTENANCE", // Bàn hỏng/Bảo trì
    HOLDING = "HOLDING"      // Bàn đang được giữ chỗ tạm thời (Redis Lock)
}

export interface TableType {
    id: string;
    table_number: string;
    is_vip: boolean;
    min_capacity: number;
    max_capacity: number;
    status: string; // Trạng thái vật lý từ Prisma (ACTIVE, INACTIVE, MAINTENANCE)
    
    shape?: string;
    pos_x?: number;
    pos_y?: number;
    width?: number;
    height?: number;
    rotation?: number;

    // Thuộc tính phục vụ (Tính toán từ backend dựa vào Order/Reservation hiện tại)
    operational_status: TableOperationalStatus;
    current_order_id?: string; // Hóa đơn đang mở tại bàn
    current_order_total?: number; // Số tiền đang mở
    time_seated?: string; // Thời gian khách bắt đầu ngồi
    reservation_id?: string; // Mã đặt bàn nếu có
    guest_name?: string; // Tên khách đặt bàn
}

export interface AreaType {
    id: string;
    name: string;
    description?: string;
    smoking_allowed: boolean;
    is_outdoor: boolean;
    floor_number: number;
    
    width?: number;
    height?: number;
    background_url?: string;
    obstacles?: any; // JSON obstacles
    
    tables: TableType[]; // Danh sách bàn thuộc khu vực này
}

export interface GetAreasWithTablesResponse {
    data: AreaType[];
}
