# KIẾN TRÚC FRONTEND: HỆ THỐNG AI CHATBOX (4 VAI TRÒ)

Tài liệu này là "Kim chỉ nam" (Blueprint) để đội ngũ Frontend (React/Next.js) thi công hệ thống giao diện AI Chatbox. Giao diện không chỉ phải đẹp mà còn phải giải quyết triệt để 3 vấn đề kỹ thuật: **Rich UI Rendering**, **Stateful Approvals**, và **Streaming (SSE)**.

---

## 1. THIẾT KẾ VỊ TRÍ & TRẢI NGHIỆM (LAYOUT & UX)

Mỗi vai trò sẽ có một Layout Chatbox riêng biệt để tối ưu hóa không gian làm việc.

### 🟢 Customer AI (Khách hàng)
- **Kiểu dáng:** Floating Action Button (FAB) - Bong bóng chat ở góc dưới màn hình.
- **Thiết kế (Aesthetics):** Trẻ trung, ấm áp. Sử dụng bo góc tròn (rounded-3xl), hiệu ứng thả bóng mềm mại (glassmorphism nhẹ).
- **Hành vi:** Khi khách hàng vào trang Menu, bóng chat tự động Pop-up một câu chào: *"Chào bạn, tôi có thể giúp bạn gợi ý món ăn hôm nay không?"*. Tối ưu hoàn toàn cho thao tác vuốt (Swipe) trên Mobile.

### 🟡 Manager AI (Quản lý nhà hàng)
- **Kiểu dáng:** Right Sidebar (Trượt từ phải sang) hoặc Panel ghim sẵn.
- **Thiết kế:** Chuyên nghiệp, màu sắc trung tính (Slate/Gray), độ tương phản cao để đọc số liệu rõ ràng dưới ánh sáng mạnh (bếp/quầy thu ngân).
- **Hành vi:** Có khả năng ghim (Pin) để luôn mở khi đang làm việc ở màn hình khác. 

### 🟠 Owner AI (Chủ thương hiệu)
- **Kiểu dáng:** Command Palette (Gọi bằng phím tắt `Ctrl + K` hoặc `Cmd + K`) hiển thị Overlay ngay giữa màn hình (như Spotlight của MacOS).
- **Thiết kế:** Đẳng cấp "Executive". Nền tối (Premium Dark Mode), chữ sáng, đổ bóng glow.
- **Hành vi:** Chủ chuỗi thường cần truy vấn nhanh. Gõ "Doanh thu tháng này", AI lập tức vẽ một biểu đồ Bar Chart ngay giữa màn hình Command Palette.

### 🔴 Admin AI (Quản trị viên SaaS)
- **Kiểu dáng:** Terminal Console (Cửa sổ dòng lệnh) ở nửa dưới màn hình hoặc Sidebar siêu kỹ thuật.
- **Thiết kế:** Monospace Font (Fira Code), nền đen nhánh (JetBlack), chữ xanh Neon.
- **Hành vi:** Giống hệt một công cụ CLI, không cần hoa mỹ, chỉ cần tốc độ và log rõ ràng.

---

## 2. KIẾN TRÚC KỸ THUẬT CỐT LÕI (CORE ARCHITECTURE)

Để xử lý việc AI trả về dữ liệu phức tạp (như danh sách món ăn, yêu cầu xác nhận duyệt đơn), Frontend không được phép dùng thẻ `<p>` để render chuỗi Text đơn thuần. Chúng ta sử dụng mẫu thiết kế **Component Registry**.

### 🛠 Cơ Chế "Dynamic Message Renderer"
Mỗi tin nhắn AI gửi về (Message Object) sẽ có trường `actionType` và `payload`.
Frontend sẽ có một Component điều hướng (Router Component):

```tsx
// Lõi Render Tin Nhắn AI
const MessageRenderer = ({ message }) => {
  // 1. Text thuần túy (Streaming Typed)
  if (message.type === 'text') {
    return <MarkdownText content={message.content} />;
  }
  
  // 2. Render UI Động (Nhận JSON từ Backend Tools)
  if (message.type === 'action') {
    switch (message.actionType) {
      case 'RENDER_MENU':
        return <MenuCarousel items={message.payload.items} />;
      case 'RENDER_REVENUE_CHART':
        return <RevenueChart data={message.payload.data} />;
      case 'APPROVE_PURCHASE_ORDER':
        return <ActionApprovalCard payload={message.payload} />;
      default:
        return <div className="text-red-500">Unrecognized UI component</div>;
    }
  }
};
```

---

## 3. CƠ CHẾ XÁC NHẬN "HUMAN-IN-THE-LOOP" (SỐNG CÒN)

Khi Backend trả về `needsUserConfirmation: true` (Ví dụ: Yêu cầu duyệt đơn mua hàng), Frontend phải tuân thủ nghiêm ngặt quy trình sau:

1. **Hiển thị ActionApprovalCard:** Một tấm thẻ nổi bật với 2 nút `[Đồng Ý]` và `[Từ Chối]`.
2. **Khóa State (Locking):** Trạng thái thẻ này phải được lưu vào **Zustand Store** kết hợp với `localStorage`. Mục đích: Đề phòng User F5 (Reload) trang web, tấm thẻ vẫn nằm đó đợi người dùng bấm, không bị mất đi (Khắc phục lỗi đứt gãy trạng thái).
3. **Thực thi REST API:** Khi bấm `[Đồng Ý]`, Frontend gọi API thực sự xuống Backend (VD: `POST /api/v1/purchase-order/approve`).
4. **Đóng băng (Freeze):** Sau khi bấm, nút `[Đồng Ý]` biến thành Loading Spinner, sau đó đổi thành `[Đã Duyệt] (Disabled)` để chống bấm đúp (Double-click spam).
5. **Phản hồi lại AI (Feedback loop):** Frontend tự động chèn 1 tin nhắn ngầm gởi lại cho AI: *"Người dùng đã xác nhận duyệt đơn thành công"*.

---

## 4. TỐI ƯU BĂNG THÔNG BẰNG SERVER-SENT EVENTS (SSE)

Khách hàng không bao giờ đủ kiên nhẫn đợi 10 giây để nhìn vòng Loading quay mòng mòng.
- Bắt buộc thay thế `axios.post` truyền thống bằng API Streaming.
- Frontend sẽ lắng nghe sự kiện từ Backend (sử dụng thư viện như `sse.js` hoặc Native `EventSource` / `fetch stream`).
- Tin nhắn AI sẽ hiện ra từng chữ (Typing Effect) theo thời gian thực (Real-time). Điều này mang lại hiệu ứng tâm lý "AI đang suy nghĩ và gõ phím rất nhanh", giúp che lấp độ trễ (Latency) 2-3 giây của quá trình gọi Tool trên Database.

> Việc tuân thủ chính xác bộ tiêu chuẩn UI/UX này sẽ giúp hệ thống Chatbox của chúng ta mang dáng dấp của một sản phẩm SaaS B2B "Triệu Đô", vượt xa các sản phẩm AI Chatbox nghiệp dư chỉ biết in ra chữ Text thông thường.
