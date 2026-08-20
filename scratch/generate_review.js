const fs = require('fs');

let md = fs.readFileSync('README.md', 'utf8');

const newReview = `---

## 🏗️ KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECH STACK)
*Được thiết kế để chịu tải cao, tối ưu hoá hiệu suất và dễ dàng mở rộng cho mô hình SaaS Multi-tenant.*

### 🎨 Frontend (Giao diện người dùng)
Frontend được xây dựng với tư duy **Feature-Sliced Design (FSD)**, chia nhỏ logic theo từng tính năng chuyên biệt (Component, Hook, Schema, Service) giúp code không bị rối khi dự án phình to.
- **Framework:** \`Next.js\` (App Router) kết hợp \`React.js\` (TypeScript). Tận dụng tối đa SSR (Server-Side Rendering) để tối ưu SEO và tốc độ tải trang ban đầu (FCP) cho các trang public, đồng thời dùng CSR cho các trang Dashboard quản trị.
- **State Management & Caching:** \`@tanstack/react-query\`. Thay vì dùng Redux cồng kềnh, hệ thống dùng React Query để quản lý server-state. Tính năng tự động deduplication (loại bỏ request trùng), cơ chế \`staleTime\` thông minh và \`Optimistic Updates\` giúp UI phản hồi tức thì, giảm tải cực lớn cho Backend.
- **Form Validation:** \`react-hook-form\` kết hợp \`Zod\`. Đây là combo mạnh mẽ nhất hiện nay để xử lý hàng chục form phức tạp. Giúp form không bị re-render liên tục khi gõ phím và chuẩn hoá kiểu dữ liệu từ Frontend xuống tận Database.
- **UI & Styling:** \`TailwindCSS\` mang lại khả năng custom giao diện linh hoạt, kết hợp với các hiệu ứng Animation/Glassmorphism mượt mà tạo cảm giác cực kỳ cao cấp (Premium UI).
- **HTTP Client:** \`Axios\` kết hợp với Interceptors để tự động đính kèm Token và xử lý lỗi tập trung.

### ⚙️ Backend (Xử lý nghiệp vụ & API)
Backend áp dụng triệt để nguyên lý **Single Responsibility Principle (SRP)** ở cấp độ file. Mỗi thao tác CRUD (Create, Read, Update, Delete) đều được tách thành các file Controller/Service/Repo riêng biệt.
- **Core Framework:** \`Node.js\` + \`Express.js\`. Mỏng, nhẹ và tuỳ biến cao.
- **Validation Middleware:** Sử dụng \`Zod\` để validate payload ngay tại cổng Router. Nếu dữ liệu sai (ví dụ: email không hợp lệ, thiếu trường require), request sẽ bị chặn lại ngay lập tức mà không cần chạm tới Controller.
- **Error Handling:** Cơ chế bắt lỗi toàn cục bằng \`AsyncHandler\` và \`Custom Error Classes\` (ConflictError, NotFoundError). Đảm bảo không bao giờ bị sập server vì Unhandled Promise Rejection, đồng thời trả về mã HTTP Status Code chuẩn RESTful.
- **Image Processing:** Tích hợp **Cloudinary** với cơ chế **Signed Uploads**. Backend *tuyệt đối không* hứng file ảnh để xử lý nhằm tiết kiệm băng thông và CPU. Thay vào đó, Backend chỉ cấp chữ ký (Signature), Frontend sẽ upload thẳng lên Cloudinary và lấy URL về lưu vào DB.

### 🗄️ Database (Cơ sở dữ liệu)
- **Database Engine:** \`MongoDB\`. Cấu trúc NoSQL linh hoạt cực kỳ phù hợp với các dữ liệu JSON động (như Rules của Khuyến mãi, Config của Nhà hàng).
- **ORM:** \`Prisma\`. Đóng vai trò là cầu nối Type-Safe. Mặc dù dùng MongoDB, Prisma giúp thiết lập các mối quan hệ (Relations) chặt chẽ như SQL, tự động generate Type cho TypeScript, giúp Developer phát hiện lỗi ngay từ lúc viết code thay vì lúc runtime.

---

## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ (GÓC NHÌN SENIOR PRO MAX LEADER)
*Dành cho nhà tuyển dụng hoặc Technical Architect: Đây là bản mổ xẻ khách quan nhất về năng lực kiến trúc của hệ thống.*

**🏆 Điểm đánh giá tổng quan: 9.0 / 10**

### ✅ ĐIỂM SÁNG XUẤT SẮC (The Good - Điểm cộng lớn với NTD)
1. **Kiến trúc Multi-tenant Tách Bạch:** Hệ thống cô lập rất tốt dữ liệu giữa \`Brand\` (Tập đoàn mẹ) và \`Restaurant\` (Chi nhánh). Thiết kế này sẵn sàng cho mô hình kinh doanh B2B SaaS (Bán tài khoản cho nhiều chuỗi nhà hàng khác nhau).
2. **Tuân thủ Nguyên lý SOLID:** Việc chia nhỏ cấu trúc thư mục thành \`routes\`, \`controllers\`, \`services\`, \`repositories\` chứng tỏ tư duy của một kĩ sư có kinh nghiệm thực chiến. Service chỉ chứa Business Logic, Repository chỉ giao tiếp DB, giúp việc Unit Test hoặc chuyển đổi Database sau này cực kỳ dễ dàng.
3. **Bảo mật & Tối ưu Băng thông (Signed Upload):** Luồng xử lý ảnh qua Cloudinary Signed URL là một kĩ thuật nâng cao, chứng minh tác giả rất hiểu về nút thắt cổ chai (Bottleneck) của Node.js khi xử lý I/O file lớn.
4. **Hệ sinh thái tính năng đồ sộ:** Tích hợp AI (RAG), quản lý toạ độ bàn 2D/3D (pos_x, pos_y), xử lý Khuyến mãi động (Conditions JSON)... Đây đều là những bài toán cực khó mà hiếm có dự án cá nhân nào dám đụng tới.

### 🛑 THIẾU SÓT & ĐỊNH HƯỚNG MỞ RỘNG (The Missing - Tư duy nhìn xa)
Để hệ thống thực sự gánh được hàng triệu request (Production-ready) và đạt điểm 10 hoàn hảo, đây là những "Tech Debt" cần giải quyết:
1. **Monolith Bottleneck ở phân hệ AI/Webhook:** Hiện tại mọi thứ đang chạy chung trên 1 server Express.js (Monolithic architecture). Khi tính năng AI Chatbot (bảng \`AIChatMessage\`) hoặc Webhook thanh toán hoạt động với tần suất cao, nó sẽ chiếm dụng Event Loop của Node.js, làm chậm các tác vụ gọi món thông thường. 
   - *Giải pháp:* Cần tách phân hệ AI và Notification ra thành các **Microservices** độc lập (có thể viết bằng Python/Go để tối ưu CPU).
2. **Vắng bóng Cache Layer (Redis):** Dự án đang phụ thuộc 100% vào MongoDB để truy xuất dữ liệu. Các dữ liệu cấu hình hệ thống, Menu nhà hàng (rất ít khi thay đổi nhưng bị query liên tục) đang gây lãng phí tài nguyên DB.
   - *Giải pháp:* Cần tích hợp Redis để làm Caching Layer.
3. **Transaction trên MongoDB:** Phân hệ Kho bãi (Inventory) và Thanh toán yêu cầu tính toàn vẹn dữ liệu tuyệt đối (ACID). Prisma có hỗ trợ Transaction cho MongoDB, nhưng yêu cầu MongoDB phải chạy ở chế độ **Replica Set**. Tác giả cần cấu hình kỹ hệ thống hạ tầng để đảm bảo không bị Race Condition khi xuất/nhập kho cùng lúc.

> **Tổng kết:** Hệ thống chứng minh tác giả có nền tảng tư duy thiết kế phần mềm (Software Architecture) cực kì vững chắc, hiểu rõ về tối ưu hệ thống, Clean Code và các Design Pattern hiện đại. Rất hiếm có Fullstack Developer nào cover được khối lượng nghiệp vụ khổng lồ và giữ được tính kỉ luật trong cấu trúc code tốt như dự án này.
`;

const splitIndex = md.indexOf("## 🕵️‍♂️ ĐÁNH GIÁ KIẾN TRÚC TỔNG THỂ");
if (splitIndex !== -1) {
    const finalMd = md.substring(0, splitIndex) + newReview;
    fs.writeFileSync('README.md', finalMd);
}
