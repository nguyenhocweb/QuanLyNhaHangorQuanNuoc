# TÀI LIỆU THAM CHIẾU - BƯỚC 5, 6 & 7 (SPRINT, TESTING & EXECUTION)

Tài liệu này quản lý việc thực thi, đo lường năng suất và cập nhật trí nhớ (Context Memory).

## BƯỚC 5: RISK-FIRST SPRINT BACKLOG & EMPIRICAL VELOCITY
- **Critical Path:** Bắt buộc vẽ sơ đồ phụ thuộc của các task. Xử lý task rủi ro kỹ thuật trước.
- **Empirical Velocity:** Đặt estimate (Story Points). Bắt buộc tự đo lường số task hoàn thành sau 2 sprint để chuẩn hóa lại vận tốc.
- **ESCALATION PROTOCOL:** Nếu Velocity thực nghiệm chậm hơn dự kiến làm đe dọa Ngân sách/Timeline (Budget Drift), **TỰ ĐỘNG VÒNG LẠI GATE 0** để cảnh báo User.

=> **[GATE 4]:** Chờ duyệt Lộ trình và Ước lượng.

## BƯỚC 6: FIXTURES, CONTRACT & LOAD TESTING (ENVIRONMENT PARITY)
- **Test Data Strategy:** Tách biệt DB DEV và TEST. Tạo Fixtures (Mock data).
- **Automated Contract Tests:** Phải đối chiếu 100% với OpenAPI ở B4.
- **Environment Parity (Đồng nhất môi trường):** Setup kịch bản Load Test (k6/JMeter). BẮT BUỘC môi trường load test phải giống hệt Production về infra và data volume.

## BƯỚC 7: EXECUTION & VALIDATED CONTEXT MEMORY
- **Luật Ghi Nhớ `CONTEXT.md`:** 
  - CHỈ ĐƯỢC GHI vào file này nếu đoạn code đi kèm log **Integration Test Pass**. (Unit test là chưa đủ).
- **Context Rotation/Summarization:**
  - Để tránh tràn RAM của LLM, nếu `CONTEXT.md` vượt quá giới hạn (VD: > 500 lines), kích hoạt cơ chế tóm tắt (summarize) nội dung cũ hoặc archive. Tối ưu token là bắt buộc.
