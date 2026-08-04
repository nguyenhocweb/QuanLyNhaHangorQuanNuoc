# Phân Tích Tính Năng Và Tác Động Theo Vai Trò

Tài liệu này phân tích các module chức năng chính của hệ thống. Mỗi module sẽ được giải thích rõ mục đích sử dụng và cách mà các vai trò (Role) khác nhau tác động vào hệ thống, giúp dễ dàng hình dung quy trình vận hành.

---

## 1. Quản lý Dữ liệu Gốc (Master Data)
**Mô tả chức năng:**
Đây là lõi dữ liệu của toàn bộ chuỗi nhà hàng. Chức năng này dùng để khởi tạo và lưu trữ cấu trúc nguyên thủy của một món ăn (Danh mục, Tên món, hình ảnh, giá gốc - basePrice, các size, các loại topping, và công thức cấu thành).

**Phân quyền và Tác động:**
- **Brand Owner**: Có toàn quyền (Tạo, Sửa, Xóa). Mọi dữ liệu do Brand Owner tạo ra là "Dữ liệu gốc". Khi Brand Owner đổi tên món hoặc xóa món, sự thay đổi này lập tức đồng bộ xuống toàn bộ các chi nhánh trực thuộc.
- **Restaurant Manager**: Chỉ có quyền Xem (Read). Không thể tự tạo thêm món lạ vào hệ thống, không thể đổi tên món, không thể xóa món khỏi cơ sở dữ liệu gốc.
- **Staff / Customer / System Admin**: Chỉ có quyền Xem thông tin món ăn (hình ảnh, giá gốc) để phục vụ việc bán hàng hoặc quản lý.

---

## 2. Quản lý Phân bổ Menu & Tùy chỉnh Cục bộ (Restaurant Menu)
**Mô tả chức năng:**
Giải quyết bài toán thực tế: Không phải chi nhánh nào cũng bán tất cả các món của thương hiệu, và giá bán ở chi nhánh quận trung tâm có thể khác giá ở ngoại thành. Nó cho phép bật/tắt món ăn và ghi đè giá bán (overridePrice) tại từng cơ sở.

**Phân quyền và Tác động:**
- **Brand Owner**: Phân bổ (Gán món A cho chi nhánh B). Có thể chủ động thiết lập giá ghi đè hoặc thu hồi quyền bán một món của chi nhánh.
- **Restaurant Manager**: 
  - Tác động rất lớn đến vận hành hàng ngày của chi nhánh. 
  - Quản lý có thể cập nhật trạng thái `isAvailable` (Còn/Hết hàng) nếu nhà bếp báo hết nguyên liệu. Món ăn lập tức bị ẩn khỏi menu của chi nhánh đó mà không ảnh hưởng đến chi nhánh khác.
  - Có thể sửa giá bán `overridePrice` tại cơ sở của mình (nếu chính sách Brand Owner cho phép).
- **Staff (Thu Ngân)**: Không có quyền thiết lập cấu hình giá, nhưng có thể được phân quyền tạm thời tắt `isAvailable` để thao tác nhanh khi đông khách và bếp báo hết món đột xuất.
- **Customer**: Tác động ở việc họ chỉ nhìn thấy các món đang ở trạng thái CÒN HÀNG tại chi nhánh họ đang xem, với mức giá cuối cùng đã được điều chỉnh riêng cho khu vực đó.

---

## 3. Quản lý Chương trình Khuyến mãi (Promotions & Vouchers)
**Mô tả chức năng:**
Tạo mã giảm giá (Voucher), giảm giá tự động (Giảm %, Giảm tiền mặt), hoặc các chiến dịch khuyến mãi đặc biệt để kích cầu doanh số bán hàng.

**Phân quyền và Tác động:**
- **Brand Owner**: 
  - Khởi tạo các chiến dịch khuyến mãi Vĩ mô (áp dụng cho toàn chuỗi hoặc một nhóm chi nhánh nhất định). 
  - Nắm quyền cao nhất trong việc quyết định ngân sách và điều kiện áp dụng (VD: Mua hóa đơn trên 200k giảm 20k).
- **Restaurant Manager**: 
  - Tạo khuyến mãi Cục bộ (chỉ áp dụng tại cơ sở của mình, ví dụ: "Khai trương chi nhánh Q1 giảm 50%").
  - Tùy vào thiết lập của Brand, Manager có thể có quyền từ chối tham gia một chương trình khuyến mãi chung của toàn chuỗi nếu chi nhánh đang quá tải hoặc không đáp ứng được chi phí.
- **Staff (Thu Ngân)**: Chỉ có quyền **Áp dụng** (Apply). Không thể tạo hay sửa khuyến mãi. Khi tính tiền, thu ngân gõ mã hoặc quét mã voucher hợp lệ để giảm giá cho khách.
- **Customer**: Thu thập mã giảm giá từ banner quảng cáo, lưu vào ví và áp dụng mã lúc thanh toán trên App/Web.
- **System Admin**: Không can thiệp vào các chương trình khuyến mãi bán lẻ đồ ăn của nhà hàng. (Chỉ tạo khuyến mãi giảm giá gia hạn gói cước phần mềm cho các Brand Owner).

---

## 4. Vận hành Bán hàng & Đơn hàng (Orders & POS)
**Mô tả chức năng:**
Tiếp nhận yêu cầu đặt món từ khách hàng, xử lý giỏ hàng, thanh toán, chuyển order xuống bếp và in hóa đơn. Là nơi sinh ra doanh thu trực tiếp.

**Phân quyền và Tác động:**
- **Staff (Thu Ngân)**: 
  - Tương tác nhiều nhất với module này. Lên đơn, chọn món, ghi chú yêu cầu đặc biệt của khách (VD: ít đá, nhiều đường), và chốt thanh toán. 
  - Tác động trực tiếp đến tính chính xác của doanh thu và quy trình phục vụ tại quán.
- **Customer**: Tự lên đơn thông qua Web/App (Quét QR tại bàn). Tạo ra Data đơn hàng thô ban đầu để hệ thống nhà hàng xử lý.
- **Restaurant Manager**: Quản lý rủi ro (Hủy đơn hàng lỗi, hoàn tiền), xem danh sách toàn bộ đơn hàng trong ca để đối soát doanh thu cuối ngày.
- **Brand Owner**: Có quyền xem (Read) tổng hợp đơn hàng của tất cả các chi nhánh để xuất báo cáo tài chính, nhưng thường không can thiệp thao tác từng đơn hàng lẻ.

---

## 5. Quản trị Nền tảng SaaS (System / Super Admin Functions)
**Mô tả chức năng:**
Quản lý cơ sở hạ tầng của hệ thống phần mềm, thiết lập các gói đăng ký thuê bao (Subscription Plan) cho các chủ nhà hàng, và quản lý cổng thanh toán hệ thống tập trung.

**Phân quyền và Tác động:**
- **System Admin**: 
  - Tạo/Sửa/Xóa các gói cước bán phần mềm (Ví dụ: Gói Basic cho 1 cửa hàng, Gói Pro cho chuỗi 10 cửa hàng).
  - Tác động sống còn đến toàn bộ nền tảng: Có quyền Khóa (Ban) toàn bộ tài khoản của một Brand nếu vi phạm chính sách hoặc chưa thanh toán tiền gia hạn phần mềm. Có quyền gỡ bỏ nội dung xấu khỏi hệ thống.
- **Brand Owner**: Truy cập để xem thời hạn gói cước của mình, thanh toán gia hạn phần mềm, hoặc mua gói nâng cấp để mở khóa thêm tính năng quản lý.
- **Restaurant Manager, Staff, Customer**: Hoàn toàn không biết và không có bất kỳ quyền truy cập nào vào khối chức năng quản lý hệ thống này.
