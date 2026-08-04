# BẢNG KIỂM TRA CHỐT CHẶN CỦA CON NGƯỜI (HUMAN APPROVAL GATES RUBRIC)

Agent BẮT BUỘC phải tự check đủ các ô `[ ]` trong Gate tương ứng trước khi dừng hệ thống và yêu cầu User phê duyệt.

## [GATE 0] - ĐỊNH HƯỚNG & RÀNG BUỘC
- `[ ]` Đã xác định rõ đối tượng dùng và KPI thành công.
- `[ ]` Đã thiết lập Definition of Done (DoD) Cấp Dự Án (Quy mô: MVP hay Enterprise).
- `[ ]` Đã thu thập NFRs (Traffic, Latency, Data Volume).
- `[ ]` Đã xác định Ngân sách (API Cost/Budget) và Timeline.
- `[ ]` Đã vẽ bảng Threat Modeling (STRIDE).

## [GATE 1] - DỮ LIỆU & BẢO MẬT
- `[ ]` Đã vẽ ERD và chiến lược Index.
- `[ ]` Đã phân loại dữ liệu (PII) và có chính sách mã hóa (Encryption).
- `[ ]` Đã định nghĩa Key Rotation SLA.
- `[ ]` Đã làm rõ trách nhiệm Migration Production và kế hoạch Rollback thủ công.

## [GATE 2] - KIẾN TRÚC & CHI PHÍ
- `[ ]` Đã áp dụng đúng Scale Switch (MVP hay Enterprise) để chọn kiến trúc.
- `[ ]` Đã thiết kế hạ tầng (Load Balancer, Caching, Worker).
- `[ ]` Đã có bảng Dự toán Chi phí (Capacity Planning).
- `[ ]` Đã viết file ADR lưu lịch sử quyết định.

## [GATE 3] - HỢP ĐỒNG KỸ THUẬT & UI/UX
*(Lưu ý: Tùy theo Scale Switch có thể tách thành 3A và 3B)*
- `[ ]` Đã có OpenAPI contract chuẩn JSend.
- `[ ]` Đã định nghĩa luồng Auth (JWT/OAuth) và Rate-limit.
- `[ ]` Đã có 3 phương án Mockup UI.
- `[ ]` Đã tính đến Accessibility (a11y) và Responsive.

## [GATE 4] - LỘ TRÌNH RỦI RO & VẬN TỐC
- `[ ]` Đã ước lượng Story Points cho các Task.
- `[ ]` Đã vẽ sơ đồ phụ thuộc (Critical Path).
- `[ ]` Đã áp dụng chiến lược Risk-First (Việc khó/rủi ro làm trước).
- `[ ]` Đã cài đặt Empirical Velocity (Lịch đo lại năng suất sau 2 sprint).

## [GATE 5] - GO/NO-GO PROD (RELEASE MANAGER)
- `[ ]` Agent đã ĐỔI MŨ sang "Independent Auditor".
- `[ ]` Đã chạy CLI SAST Tool và có log quét bảo mật tĩnh.
- `[ ]` Đã gọi script Sub-Agent (`tools/hostile_auditor.py`) để kiểm tra kiến trúc.
- `[ ]` Điểm Rubric 10/10 tuyệt đối, không có lỗi Critical.
