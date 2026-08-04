# TÀI LIỆU THAM CHIẾU - BƯỚC 2, 3 & 4 (ARCHITECTURE & CONTRACT)

Tài liệu này định hình bộ khung hạ tầng và hợp đồng giao tiếp, tuân thủ nguyên tắc "Scale Switch" chống Over-engineering.

## BƯỚC 2: SYSTEM ARCHITECTURE & SCALE SWITCH
- **Scale Switch (Cơ chế tùy biến):**
  - Đọc phân loại dự án ở B0. Nếu là MVP: Bỏ qua Multi-region, dùng kiến trúc tối giản.
  - Nếu là Enterprise: Bắt buộc kích hoạt Active-Active DR (Disaster Recovery).
- **Capacity Planning:** Lập dự toán chi phí hàng tháng cho Infra. **BẮT BUỘC** trích lập một phần ngân sách (Budget) cho các lượt gọi LLM API của Sub-Agent (Hostile Auditor) ở Gate 5 và đối chiếu với giới hạn chi phí ở Bước 0.
- **ADR:** Bắt buộc ghi lại mọi quyết định vào `docs/ADRs`.

=> **[GATE 2]:** Chờ duyệt Architecture & Cost Estimate.

## BƯỚC 3: TECH STACK, SCAFFOLDING & CONTINUOUS AUDIT
- **Quản lý Secrets:** Sử dụng Vault/KMS hoặc `.env.example`. Không hard-code. **BẮT BUỘC** khai báo biến `GEMINI_API_KEY` (hoặc API Key tương ứng) ngay từ bước này để chuẩn bị cho Gate 5 Hostile Auditor.
- **OSS License & Continuous Audit:** 
  - Audit license của third-party libs.
  - Setup Dependabot/Renovate.
  - **SLA Vá Lỗi (Patch SLA):** Critical (24h), High (3 ngày), Low (1 Sprint).

## BƯỚC 4: CONTRACT, SECURITY FLOW & UX STRATEGY
- **4A (API & Security):** JSend format, Versioning. Auth Flow (JWT Rotation/OAuth). Khai báo Rate-limit policy tại OpenAPI.
- **4B (UI/UX):** 3 phương án Mockup. Tiêu chuẩn Accessibility (a11y) và Responsive.
- **Scale Switch Gating:**
  - Nếu MVP -> Gộp 4A và 4B thành **GATE 3**.
  - Nếu Enterprise -> Tách thành **GATE 3A** và **GATE 3B**.

=> **[GATE 3 / 3A, 3B]:** Chờ duyệt Hợp đồng và Giao diện.
