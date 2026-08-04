# TÀI LIỆU THAM CHIẾU - BƯỚC 8, 9 & 10 (AUDIT & DEVOPS)

Tài liệu này là chốt chặn cuối cùng, bảo vệ hệ thống khỏi lỗi logic và thảm họa mất dữ liệu khi Release.

## BƯỚC 8: INDEPENDENT REVIEW (DUAL AUDIT)
Loại bỏ hoàn toàn điểm mù của LLM (Conflict of Interest).
- **Quy tắc Kiểm toán Kép:** Agent KHÔNG TỰ REVIEW. Bắt buộc dùng ĐỒNG THỜI 2 lớp:
  1. Chạy CLI Tool SAST ngoại vi (VD: npm audit, eslint-plugin-security).
  2. Kích hoạt Sub-Agent độc lập (Persona Auditor) qua script cách ly API để check kiến trúc.
- Sử dụng Rubric 10/10.

=> **[GATE 5]:** Chờ duyệt Báo cáo Kiểm toán (Go/No-go Prod).

## BƯỚC 9: DEVOPS, IAC, CANARY & SAFE AUTO-ROLLBACK
Triển khai cẩn trọng, phản ứng tự động.
- **Pipeline & IaC:** Hoàn thiện CI/CD, Terraform/Ansible.
- **Canary Release:** Cấp 10% traffic.
- **Safe Auto-Rollback Thresholds:**
  - Code/Traffic: Tự động rollback nếu Error Rate > 5%.
  - **Data Schema: TUYỆT ĐỐI CẤM TỰ ĐỘNG ROLLBACK DB SCHEMA**. Bắn alert và chờ con người bấm nút.
- **In-flight Requests:** Khi hệ thống bị freeze chờ người duyệt lỗi Schema, cấu hình Load Balancer trả về `503 Service Unavailable` hoặc đẩy vào Dead Letter Queue để bảo vệ Data Consistency.

## BƯỚC 10: POST-DEPLOYMENT LOOP
Đóng vòng lặp, kiểm chứng thành công.
- Thu thập Tech Metrics (So sánh với B0).
- Thu thập Business Metrics (Product-Market Fit, Retention).
- Đối chiếu với **Definition of Done (DoD)** ở B0 để xác nhận thành công dự án.
- Iterate từ Bước 0 hoặc Bước 5.
