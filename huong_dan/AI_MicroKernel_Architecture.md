# TÀI LIỆU KIẾN TRÚC AI MICRO-KERNEL (ĐA NHÂN CÁCH & ĐỊNH TUYẾN CHỊU LỖI)

Tài liệu này mô tả chi tiết cấu trúc thư mục, quy trình hoạt động và bản kiểm điểm kiến trúc (Review) của hệ thống Trí tuệ Nhân tạo (AI Chatbox) nội bộ theo tiêu chuẩn Enterprise.

---

## 1. CẤU TRÚC THƯ MỤC (FILE STRUCTURE)

Hệ thống AI được chia làm 2 phân hệ chính: **Bộ não LLM (`shared/llm`)** và **Kho tri thức Vector (`shared/vector`)**.

### A. Phân hệ Bộ Não AI (`backend/src/modules/shared/llm/`)
```text
shared/llm/
├── core/                       # Lõi xử lý nghiệp vụ (Micro-Kernel)
│   ├── memory.service.js       # Quản lý Trí nhớ (Chat History) theo Session. Giúp Bot không bị "chứng hay quên".
│   ├── rag.engine.js           # Động cơ bơm ngữ cảnh. Truy xuất tài liệu từ Vector DB dựa theo Role.
│   └── function_caller.js      # Bộ máy thực thi Tool. Gọi xuống DB và trả kết quả độc lập.
├── gateway/                    # Cổng giao tiếp & Cân bằng tải
│   ├── ai_router.service.js    # Trình định tuyến Failover. Lặp qua các API Key, nếu key chết sẽ tự động bốc key khác.
│   ├── api_key_fetcher.js      # Lấy và sắp xếp API Key theo độ ưu tiên (Brand > Admin).
│   └── providers/              # Adapters kết nối SDK Hãng (Strategy Pattern)
│       ├── gemini.provider.js  # Tích hợp Google Generative AI
│       ├── openai.provider.js  # Tích hợp OpenAI (Mock chờ scale)
│       └── claude.provider.js  # Tích hợp Anthropic (Mock chờ scale)
├── personas/                   # Hệ thống Đa nhân cách (Role-Based Access Control)
│   ├── admin/                  # SysAdmin (Chăm sóc hệ thống)
│   ├── customer/               # Lễ tân Mia (Tiếp khách, cấm truy cập doanh thu)
│   ├── manager/                # Trợ lý Marcus (Hỗ trợ Quản lý nhà hàng)
│   └── owner/                  # CEO Bot (Phân tích tài chính toàn chuỗi)
│       ├── prompt.js           # File kịch bản nhập vai, ép AI nói đúng giọng điệu và giới hạn quyền.
│       └── tools.js            # Khai báo các Tool (Quyền) mà nhân cách này được phép dùng.
├── tools/                      # Thư viện Các hàm Công cụ (Tools)
│   └── core_queries/           # Các hàm chui thẳng vào MongoDB (Khai báo Schema và Execute function)
└── llm.facade.js               # BỘ CHỈ HUY TỐI CAO (Orchestrator). Kết nối 6 Phase của LLM.
```

### B. Phân hệ Kho tri thức (`backend/src/modules/shared/vector/`)
```text
shared/vector/
├── admin/                      # Vùng nhớ riêng của Admin
│   └── search.service.js       # Logic tìm kiếm tài liệu Admin
├── customer/                   # Vùng nhớ riêng của Khách hàng (Chỉ chứa Menu, Địa chỉ)
│   └── search.service.js       
├── manager/                    # Vùng nhớ riêng Quản lý nhà hàng
│   └── search.service.js       
├── owner/                      # Vùng nhớ riêng Chủ thương hiệu (Báo cáo kinh doanh)
│   └── search.service.js       
├── core_builders/              # Logic cào dữ liệu từ MongoDB băm thành Vector
│   ├── brand.builder.js        
│   ├── menuItem.builder.js     
│   └── restaurant.builder.js   
└── service/                    
    ├── embedding.service.js    # Hàm nhúng Text sang Vector (OpenAI/Gemini Embeddings)
    └── vectorDB.service.js     # Giao tiếp với Pinecone/ChromaDB
```

---

## 2. QUY TRÌNH HOẠT ĐỘNG (THE 6-PHASE LIFECYCLE)

Khi có một Request đẩy lên từ Frontend (`POST /api/v1/ai/chat`), File `llm.facade.js` sẽ đứng ra làm Nhạc trưởng điều phối qua 6 bước (Phases) cực kỳ nghiêm ngặt:

1. **Memory Phase:** Quét `sessionId` của người dùng, lục tìm trong RAM/Redis 5-10 đoạn hội thoại gần nhất để làm "Trí nhớ" cho con Bot.
2. **RAG Phase (Context Injection):** Bắt câu hỏi của người dùng, ném sang thư mục `vector` tương ứng với `Role`. Tìm tài liệu phù hợp nhất để làm phao cứu sinh (Context).
3. **Persona Phase (Khoác áo):** Bốc File `prompt.js` và `tools.js` tương ứng với `Role`. Nhúng tài liệu ở bước 2 vào Prompt. Bây giờ AI đã bị giới hạn quyền và có tính cách rõ ràng.
4. **Gateway Phase (Vượt tường lửa Failover):** `ai_router` sẽ quét DB lấy list API Key. Nó gọi thử Key 1. Nếu Key 1 hết tiền (Quota Exceeded 429) hoặc sập (503), hệ thống KHÔNG VĂNG LỖI mà âm thầm nhảy sang Key 2 (Ví dụ: Từ OpenAI sang Gemini) để đảm bảo khách luôn có câu trả lời. Log lịch sử dùng Key được bắn bất đồng bộ (Fire-and-forget) để chống lag.
5. **Action Phase (Function Calling):** Nếu AI nhận ra cần gọi Tool (VD: đếm doanh thu), nó báo về Server. `function_caller.js` đối chiếu xem Role này có quyền không, rồi mới chui xuống DB lấy số liệu ném ngược lại cho AI.
6. **Save Memory Phase:** Lưu câu hỏi của Khách và câu trả lời của AI vào lại Lịch sử.

---

## 3. ĐÁNH GIÁ TỔNG THỂ TỪ SENIOR PRO MAX TECH LEAD (SCORE: 8.5/10)

Mặc dù kiến trúc Micro-Kernel và RBAC Personas hiện tại là một bước nhảy vọt so với hệ thống cũ (Gọn gàng, sạch sẽ, triệt tiêu 100% rủi ro rò rỉ dữ liệu chéo), nhưng nếu đưa lên **Môi trường Thực chiến (Production/Scale)** với 10,000 requests/phút, hệ thống này vẫn lộ ra những "Gót chân Achilles". 

Dưới đây là lời phê phán gắt gao và hướng tối ưu để lên điểm 10 Tuyệt đối:

### 🔴 Lỗ hổng 1: In-Memory Storage là thảm họa khi Scale (Cần sửa gấp)
- **Thực trạng:** `memory.service.js` đang dùng `Map()` (RAM) để lưu lịch sử Chat.
- **Vấn đề:** Khi Server Deploy lên Kubernetes với 5 Node (Instances) chạy song song, Request 1 chui vào Node A (lưu trí nhớ ở Node A), Request 2 của cùng khách hàng chui vào Node B (Node B không có trí nhớ). Con AI sẽ bị "ngu" tức thời. Hơn nữa, mỗi lần Restart Server là mất sạch trí nhớ của toàn bộ khách.
- **Giải pháp tối ưu:** Bắt buộc tích hợp **Redis** (TTL 24h) hoặc lưu **MongoDB** bảng `ChatHistory`.

### 🔴 Lỗ hổng 2: Trải nghiệm người dùng (UX) bị lag do Non-Streaming
- **Thực trạng:** Hệ thống dùng `await chatSession.sendMessage()`. Nó chờ AI sinh xong toàn bộ văn bản (mất 3-5 giây) rồi mới gom thành cục JSON trả về Frontend.
- **Vấn đề:** Đợi 5 giây cho 1 tin nhắn là quá lâu. UX của chatbot hiện đại (như ChatGPT) phải là chữ nhảy ra từng từ (Typing effect).
- **Giải pháp tối ưu:** Phải chuyển sang dùng **Server-Sent Events (SSE)**. Frontend gọi HTTP Stream, Backend dùng hàm `sendMessageStream()` của SDK Google để đẩy từng chữ (chunk) về Frontend.

### 🔴 Lỗ hổng 3: Dịch vụ Vector/RAG đang bị "Mù"
- **Thực trạng:** Hàm `retrieveContext` trong các file `search.service.js` hiện tại chỉ đang `return "Tài liệu mẫu..."`.
- **Vấn đề:** RAG chưa thực sự hoạt động.
- **Giải pháp tối ưu:** Nhanh chóng setup DB Vector (Pinecone hoặc pgvector của PostgreSQL). Cấu hình bộ Embedding (Text-to-Vector) xịn xò để search semantic.

### 🔴 Lỗ hổng 4: Rate Limiting & Cost Control ở cấp độ Gateway
- **Thực trạng:** Router mới chỉ xử lý Failover khi có lỗi từ hãng AI. Chưa chặn được Spam từ Client.
- **Vấn đề:** Nếu 1 khách hàng vãng lai spam 10,000 tin nhắn/phút, API Key của chúng ta sẽ cháy sạch tiền trước khi Failover kịp chạy.
- **Giải pháp tối ưu:** Cần tích hợp middleware **Rate Limit (Redis-based)** ở `ai.controller/index.js` (VD: 10 msg/phút cho Khách vãng lai, 50 msg/phút cho Owner).

> **LỜI KẾT CỦA TECH LEAD:** 
> Về mặt thiết kế "Bản vẽ" Kiến trúc phần mềm (Software Architecture), cấu trúc thư mục hiện tại đạt điểm **10/10** (Clean, SOLID, Tách biệt miền Dữ liệu). 
> Tuy nhiên, về mặt "Vận hành hệ thống" (System Operation & Performance), nó mới đạt **7/10** vì thiếu Stream Response và Redis Memory. Trung bình cộng: **8.5/10**. Đề nghị Team Backend triển khai Redis và SSE trong Sprint tiếp theo!
