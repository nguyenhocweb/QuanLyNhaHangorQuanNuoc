import { prisma } from "../init.mongodb.js";

async function seedContactTickets() {
  console.log("🌱 Bắt đầu Seeding dữ liệu mẫu cho ContactTicket...");

  try {
    await prisma.contactTicket.deleteMany({});

    const sampleTickets = [
      {
        ticketCode: "TK-20260901-8841",
        guestName: "Trần Đăng Khoa (Chủ chuỗi trà sữa TocoToco)",
        guestEmail: "khoa.tran@tocotoco.vn",
        guestPhone: "0912345678",
        hasZalo: true,
        subject: "Cần tư vấn gói giải pháp Kiosk và POS cho 15 chi nhánh",
        message: "Chào ban quản trị NVNguyen, chúng tôi đang chuẩn bị khai trương đồng loạt 15 chi nhánh mới tại TP.HCM và Hà Nội. Chúng tôi cần tư vấn báo giá trọn gói thiết bị Kiosk cảm ứng, phần mềm quản lý kho realtime và chiết khấu cho doanh nghiệp F&B lớn.",
        status: "OPEN",
        priority: "HIGH",
        adminNote: "Khách hàng doanh nghiệp lớn (Chuỗi 15 quán), cần Lead Sales gọi trực tiếp qua Zalo trong sáng nay.",
        createdAt: new Date(Date.now() - 1000 * 60 * 25) // 25 phút trước
      },
      {
        ticketCode: "TK-20260901-4920",
        guestName: "Lê Mỹ Duyên",
        guestEmail: "myduyen.le@gmail.com",
        guestPhone: "0987112233",
        hasZalo: true,
        subject: "Hỏi về cách tích hợp cổng thanh toán VietQR",
        message: "Cho mình hỏi nhà hàng mình đăng ký tài khoản Brand rồi thì làm sao để liên kết tài khoản ngân hàng nhận tiền tự động qua mã QR động trên bàn?",
        status: "PROCESSING",
        priority: "MEDIUM",
        adminNote: "Đã liên hệ qua Zalo hướng dẫn cài đặt API Key VietQR và gửi tài liệu PDF hướng dẫn.",
        adminReply: "Chào chị Duyên, đội ngũ kỹ thuật đã gửi tài liệu hướng dẫn liên kết VietQR qua Zalo cho chị rồi ạ!",
        assignedTo: "Nguyễn Văn Nguyên",
        createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 tiếng trước
      },
      {
        ticketCode: "TK-20260831-1052",
        guestName: "Phạm Hồng Quân",
        guestEmail: "quan.pham@bepviet.com",
        guestPhone: "0933998877",
        hasZalo: false,
        subject: "Đã hoàn tất hỗ trợ cấu hình máy in hóa đơn LAN",
        message: "Máy in bill nhiệt tại quầy thu ngân chi nhánh Quận 1 không nhận lệnh in khi khách thanh toán xong.",
        status: "RESOLVED",
        priority: "URGENT",
        adminNote: "Kỹ thuật đã Ultraviewer xử lý xong trong 10 phút, máy in nhận IP tĩnh hoạt động bình thường.",
        adminReply: "Hệ thống máy in của nhà hàng đã được khắc phục hoàn toàn. Chúc nhà hàng kinh doanh phát đạt!",
        assignedTo: "Trần Minh Đức",
        resolvedAt: new Date(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 ngày trước
      }
    ];

    for (const t of sampleTickets) {
      await prisma.contactTicket.create({ data: t });
    }

    console.log(`✅ Đã tạo thành công ${sampleTickets.length} phiếu hỗ trợ mẫu.`);
  } catch (error) {
    console.error("❌ Lỗi Seeding ContactTicket:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContactTickets();
