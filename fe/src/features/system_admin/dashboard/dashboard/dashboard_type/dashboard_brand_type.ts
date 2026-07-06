type StatusType = "ACTIVE"|"PENDING"|"INACTIVE"|"TERMINATED";

// 2. Định nghĩa Interface cho Brand
export interface getDashboardBrands_Reponse {
    id: string;
    name: string;
    isActive: StatusType; // Ràng buộc chỉ được nhận 1 trong 3 chuỗi trên
    tax_code: string;
    createdAt: string;    // Thời gian ở dạng chuỗi ISO
    logo: string;
    isFeatured: boolean;
}