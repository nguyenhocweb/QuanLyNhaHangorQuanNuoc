# BẢN GHI QUYẾT ĐỊNH KIẾN TRÚC (ADR)
Số thứ tự: ADR-XXX

## Tựa đề (Title)
[Tên quyết định ngắn gọn, ví dụ: Chọn Redis managed service thay vì self-host]

## Ngày tháng (Date)
[YYYY-MM-DD]

## Trạng thái (Status)
[Đề xuất / Được Chấp Nhận / Đã Hủy / Bị Thay Thế]

## Bối cảnh (Context)
[Vấn đề kỹ thuật hoặc yêu cầu kinh doanh buộc chúng ta phải đưa ra quyết định này. Đề cập đến NFRs và Budget đã được chốt ở Bước 0].

## Quyết định (Decision)
[Quyết định cuối cùng là gì? Giải thích rõ về mặt kỹ thuật].

## Các lựa chọn đã xem xét (Considered Options)
1. Option A (Ví dụ: Self-host Redis trên VPS).
2. Option B (Ví dụ: Dùng AWS ElastiCache).

## Đánh đổi (Consequences / Trade-offs)
- **Điểm lợi (Pros):** [VD: Dễ maintain, HA có sẵn].
- **Điểm hại (Cons):** [VD: Chi phí cao hơn 20% mỗi tháng].

## Xác nhận từ Scale Switch
Quyết định này có phù hợp với quy mô dự án (MVP/Enterprise) được định nghĩa ở DoD không?
- [ ] Phù hợp. Giải thích: ...
