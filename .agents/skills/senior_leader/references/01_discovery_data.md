# TÀI LIỆU THAM CHIẾU - BƯỚC 0 & 1 (DISCOVERY & DATA)

Tài liệu này chứa các quy tắc khắt khe nhất để định hướng dự án và thiết kế cơ sở dữ liệu.

## BƯỚC 0: DISCOVERY, NFR, STRIDE & CONSTRAINTS
Ngăn chặn tech debt từ khi dự án chưa bắt đầu.

- **Definition of Done (DoD) Cấp Dự Án:** Không duyệt dự án nếu User chưa định nghĩa rõ thế nào là xong. (Phân loại: MVP hay Enterprise? Dựa trên traffic/doanh thu mong đợi).
- **Non-Functional Requirements (NFRs):** Bắt buộc hỏi rõ Traffic, Data volume, Latency.
- **Constraints (Ràng buộc):** 
  - Deadline và Nhân sự.
  - Ngân sách (Budget): Cần xác định giới hạn chi phí cho API (VD: $50/tháng cho lượt gọi LLM Sub-Agent ở Gate 5). Ngân sách này sẽ được theo dõi qua `audit_call_count` trong quá trình code.
- **Threat Modeling (STRIDE):** Kẻ bảng phân tích 6 bề mặt tấn công:
  - Spoofing (Giả mạo)
  - Tampering (Thay đổi dữ liệu)
  - Repudiation (Từ chối trách nhiệm)
  - Information Disclosure (Lộ dữ liệu)
  - Denial of Service (Tấn công từ chối dịch vụ)
  - Elevation of Privilege (Leo thang đặc quyền)

=> **[GATE 0]:** Chờ duyệt DoD, NFR, Ngân sách.

## BƯỚC 1: DATA MODELING, LIFECYCLE & ENCRYPTION
Dữ liệu sống lâu hơn code. Bảo vệ dữ liệu là nhiệm vụ tối thượng.

- **ERD & Index:** Đánh index dựa trên NFRs (Traffic).
- **Data Classification & Encryption:** Phân loại PII (Personally Identifiable Information). Các trường này BẮT BUỘC có chiến lược mã hóa (at-rest & in-transit).
  - **Key Rotation Policy:** Yêu cầu SLA xoay vòng khóa (VD: 90 ngày đổi key 1 lần).
- **Data Lifecycle:** Chiến lược xóa/lưu trữ (Soft-delete/Hard-delete) theo GDPR.
- **Production Migration Strategy:** Định rõ ai update schema? Cách rollback thủ công khi hỏng dữ liệu thật.

=> **[GATE 1]:** Chờ duyệt Data Model, Encryption và Migration.
