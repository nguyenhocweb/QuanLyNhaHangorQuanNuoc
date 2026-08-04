# KIỂM TOÁN KÉP (DUAL AUDIT PROTOCOL) - BƯỚC 8

Đây là quy trình sinh tử loại bỏ điểm mù của LLM. Agent KHÔNG ĐƯỢC TỰ CHẤM ĐIỂM BẰNG CẢM TÍNH.
Để Gate 5 Pass, cả 2 lớp kiểm toán dưới đây phải thành công.

## Lớp 1: Static Application Security Testing (SAST)
Agent phải sử dụng tool Terminal/Run_Command để chạy các lệnh quét tĩnh trên source code. Tùy thuộc vào ngôn ngữ dự án:
- **Node.js:** `npm audit` và `npx eslint . --ext .js,.ts,.tsx`
- **Python:** `bandit -r .` hoặc `flake8`
- **Go:** `gosec ./...`

**Yêu cầu:** Nếu tool SAST báo lỗi có mức độ High/Critical, Agent BẮT BUỘC phải từ chối PR và sửa lại code.

## Lớp 2: Sub-Agent Isolation (API Cách Ly)
Agent không được tự review logic của mình. Phải thực thi Script Python gọi API LLM cách ly hoàn toàn với context hiện tại.

**Yêu cầu Môi trường:** 
- User hoặc Agent phải cấu hình biến môi trường `GEMINI_API_KEY` trước khi chạy script. (VD: `$env:GEMINI_API_KEY="your_key"`).

**Cách thực thi:**
```bash
python .agents/skills/senior_leader/tools/hostile_auditor.py "src/path_to_code.js" "swagger.yaml" "docs/ADRs/"
```
*(Tham số thứ 2 trở đi có thể là file contract hoặc CẢ THƯ MỤC chứa nhiều file ADR. Script sẽ tự đọc và ghép tất cả làm ngữ cảnh).*

**Quy tắc Quyết định Gate 5:**
- Kịch bản chạy sẽ in ra nhận xét chi tiết của Hostile Auditor và trả về Exit Code.
- DÙ KẾT QUẢ PASS HAY FAIL: Ngay sau khi script chạy xong, Agent **BẮT BUỘC** phải tăng field `audit_call_count` trong file `session_state.json` lên 1 (Ghi nhận số lượng API Call thực tế).
- Nếu Exit Code là `1` (Chứa chuỗi `[AUDITOR_RESULT: REJECT]`), Gate 5 **THẤT BẠI**. Lập tức báo lỗi, lùi về Bước 7 để fix code và đọc lại file `03_execution_testing.md`.
- Nếu Exit Code là `0` (Chứa chuỗi `[AUDITOR_RESULT: APPROVE]`), Gate 5 **THÀNH CÔNG**. Tiến hành xuất Báo cáo Gate 5 (theo `template_gate5_report.md`).
