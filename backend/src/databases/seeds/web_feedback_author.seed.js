import { prisma } from "../init.mongodb.js";
import { FeedbackStatus, FeedbackCategory, DeveloperRole } from "../prisma/generated/prisma/index.js";

async function seedWebAuthorAndFeedback() {
  console.log("🌱 Bắt đầu Seeding dữ liệu mẫu cho WebAuthor và WebFeedback...");

  try {
    // 1. Xóa dữ liệu cũ nếu có
    await prisma.webAuthor.deleteMany({});
    await prisma.webFeedback.deleteMany({});

    // 2. Seed Web Authors (Đội ngũ phát triển)
    console.log("--- Seeding Web Authors ---");
    const authorsData = [
      {
        fullName: "Nguyễn Văn Nguyên",
        role: DeveloperRole.PROJECT_LEAD,
        roleTitle: "Lead Fullstack Architect & Project Founder",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
        bio: "Hơn 8 năm kinh nghiệm thiết kế kiến trúc hệ thống phân tán, tối ưu hóa Cloud và phát triển giải pháp F&B toàn diện cho hàng trăm chuỗi nhà hàng.",
        techStack: ["Next.js", "React", "Node.js", "Express", "MongoDB", "Prisma", "TailwindCSS", "Docker", "Redis"],
        contributions: [
          "Chủ trì thiết kế kiến trúc Clean Architecture & Database Schema",
          "Xây dựng hạ tầng Real-time Ordering & Kiosk System",
          "Tối ưu hiệu năng, bảo mật và trải nghiệm đa nền tảng"
        ],
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        portfolioUrl: "https://nvnguyen.dev",
        email: "nvnremix@gmail.com",
        phone: "0935884541",
        hasZalo: true,
        zaloUrl: "https://zalo.me/0935884541",
        displayOrder: 1,
        isActive: true,
        isLeader: true
      },
      {
        fullName: "Trần Minh Đức",
        role: DeveloperRole.BACKEND_DEV,
        roleTitle: "Senior Backend & DevOps Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
        bio: "Chuyên gia về Microservices, API Gateway, tối ưu hóa truy vấn cơ sở dữ liệu MongoDB và thiết lập luồng CI/CD tự động hóa.",
        techStack: ["Node.js", "Express.js", "MongoDB", "Prisma ORM", "Docker", "Kubernetes", "AWS", "Nginx"],
        contributions: [
          "Phát triển hệ thống Authentication JWT & Role-Based Access Control",
          "Xây dựng Payment Gateway tích hợp MoMo, ZaloPay & VietQR",
          "Tối ưu hóa Index & Aggregation Pipeline cho báo cáo doanh thu"
        ],
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        email: "duc.tran@example.com",
        phone: "0918765432",
        hasZalo: true,
        zaloUrl: "https://zalo.me/0918765432",
        displayOrder: 2,
        isActive: true,
        isLeader: false
      },
      {
        fullName: "Lê Hoàng Yến",
        role: DeveloperRole.FRONTEND_DEV,
        roleTitle: "Senior Frontend & UI/UX Specialist",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
        bio: "Tập trung vào trải nghiệm người dùng tinh gọn, hiệu ứng vi tương tác (Micro-animations), thiết kế 3D WebGL và tối ưu tốc độ tải trang Core Web Vitals.",
        techStack: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Three.js", "React Query"],
        contributions: [
          "Phát triển giao diện POS Kiosk cảm ứng siêu mượt",
          "Thiết kế Design System và bộ Component dùng chung chuẩn Atomic",
          "Tối ưu Responsive toàn diện từ Mobile đến Màn hình 4K"
        ],
        githubUrl: "https://github.com",
        portfolioUrl: "https://yenle.design",
        email: "yen.le@example.com",
        phone: "0934567890",
        hasZalo: true,
        zaloUrl: "https://zalo.me/0934567890",
        displayOrder: 3,
        isActive: true,
        isLeader: false
      },
      {
        fullName: "Phạm Quốc Bảo",
        role: DeveloperRole.UI_UX_DESIGNER,
        roleTitle: "Lead UI/UX Product Designer",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
        bio: "Nghiên cứu hành vi người dùng trong ngành ẩm thực F&B để kiến tạo giao diện trực quan, giảm thiểu 50% thời gian đặt bàn và gọi món.",
        techStack: ["Figma", "Design Tokens", "Wireframing", "Usability Testing", "Tailwind Design"],
        contributions: [
          "Nghiên cứu UX Flow cho nhân viên phục vụ bàn và quản lý nhà hàng",
          "Chuẩn hóa bộ màu sắc Soft UI và phong cách Glassmorphism",
          "Tạo mẫu tương tác Prototype và kiểm thử người dùng thực tế"
        ],
        linkedinUrl: "https://linkedin.com",
        portfolioUrl: "https://baopham.framer.website",
        phone: "0977112233",
        hasZalo: false,
        displayOrder: 4,
        isActive: true,
        isLeader: false
      },
      {
        fullName: "Đỗ Thanh Hằng",
        role: DeveloperRole.QA_QC,
        roleTitle: "Lead QA/QC & Automation Test Engineer",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
        bio: "Chịu trách nhiệm kiểm soát chất lượng phần mềm, đảm bảo không có lỗ hổng bảo mật, kiểm thử tải (Stress test) cho giờ cao điểm nhà hàng.",
        techStack: ["Jest", "Playwright", "Cypress", "Postman", "K6 Load Testing"],
        contributions: [
          "Xây dựng bộ kiểm thử tự động E2E cho quy trình đặt món và thanh toán",
          "Kiểm thử chịu tải đồng thời 5,000 kết nối WebSocket realtime",
          "Bảo đảm an toàn dữ liệu và tuân thủ các chuẩn bảo mật"
        ],
        linkedinUrl: "https://linkedin.com",
        email: "hang.do@example.com",
        phone: "0988990011",
        hasZalo: true,
        zaloUrl: "https://zalo.me/0988990011",
        displayOrder: 5,
        isActive: true,
        isLeader: false
      }
    ];

    for (const a of authorsData) {
      await prisma.webAuthor.create({ data: a });
    }
    console.log(`✅ Đã tạo thành công ${authorsData.length} thành viên đội ngũ phát triển.`);

    // 3. Seed Web Feedbacks (Đánh giá trang web)
    console.log("--- Seeding Web Feedbacks ---");
    const feedbacksData = [
      {
        guestName: "Trần Bảo Nam (CEO Chuỗi Golden Spoon)",
        guestEmail: "nam.tran@goldenspoon.vn",
        guestPhone: "0901234567",
        rating: 5,
        title: "Hệ thống quản lý nhà hàng mượt mà và tối ưu nhất từng dùng!",
        content: "Giao diện Kiosk gọi món và quản lý bàn thời gian thực cực kỳ ổn định. Từ khi áp dụng giải pháp của NVNguyen, chi phí vận hành nhân sự tại chuỗi của chúng tôi đã giảm gần 30%, khách hàng cực kỳ hài lòng với tốc độ gọi món.",
        category: FeedbackCategory.PERFORMANCE,
        pageUrl: "http://localhost:3000",
        deviceInfo: "Chrome 128 on macOS Sonoma (Apple M2)",
        screenResolution: "1920x1080",
        status: FeedbackStatus.APPROVED,
        isFeatured: true,
        adminReply: "Chân thành cảm ơn anh Nam và chuỗi Golden Spoon đã tin tưởng đồng hành! Đội ngũ sẽ tiếp tục nâng cấp thêm các thuật toán gợi ý món ăn bằng AI trong phiên bản tới.",
        repliedAt: new Date(),
        isHelpfulCount: 42
      },
      {
        guestName: "Nguyễn Thị Hương Giang (Food Reviewer)",
        guestEmail: "giang.foodie@gmail.com",
        guestPhone: "0987654321",
        rating: 5,
        title: "Trải nghiệm UI/UX đỉnh cao, đặt bàn siêu nhanh",
        content: "Mình rất ấn tượng với giao diện 3D và màu sắc hiện đại của website. Thao tác chọn bàn, áp voucher giảm giá và thanh toán trực tuyến diễn ra trong chưa đầy 1 phút. Cực kỳ chuyên nghiệp!",
        category: FeedbackCategory.UI_UX,
        pageUrl: "http://localhost:3000/restaurants",
        deviceInfo: "Safari on iPhone 15 Pro Max (iOS 17.5)",
        screenResolution: "430x932",
        status: FeedbackStatus.APPROVED,
        isFeatured: true,
        adminReply: "Cảm ơn bạn Giang đã có những đánh giá rất chi tiết và tích cực cho trải nghiệm người dùng của hệ thống!",
        repliedAt: new Date(),
        isHelpfulCount: 28
      },
      {
        guestName: "Hoàng Văn Tuấn (Quản lý Chi nhánh Lẩu Haidilao)",
        guestEmail: "tuan.hoang@haidilao.com",
        rating: 4,
        title: "Tính năng quản lý kho và báo cáo realtime rất chuẩn xác",
        content: "Phân hệ báo động nguyên liệu sắp hết và đồng bộ đơn hàng xuống bếp hoạt động rất tốt. Nếu bổ sung thêm tính năng xuất hóa đơn đỏ điện tử tự động qua email cho khách thì sẽ trọn vẹn 5 sao.",
        category: FeedbackCategory.FEATURE,
        pageUrl: "http://localhost:3000/quan-ly-nha-hang/inventory",
        deviceInfo: "Edge 128 on Windows 11 Pro",
        screenResolution: "2560x1440",
        status: FeedbackStatus.APPROVED,
        isFeatured: true,
        adminReply: "Đội ngũ phát triển đã tiếp nhận đề xuất hóa đơn điện tử tự động của anh Tuấn và sẽ phát hành trong bản cập nhật tháng tới.",
        repliedAt: new Date(),
        isHelpfulCount: 19
      },
      {
        guestName: "Đỗ Quốc Đạt (Khách hàng thân thiết)",
        guestEmail: "dat.do@gmail.com",
        rating: 4,
        title: "Ví Voucher tích hợp rất tiện lợi",
        content: "Ứng dụng mượt, nhiều ưu đãi hấp dẫn. Trước đây thỉnh thoảng bị lag nhẹ khi tải danh sách chi nhánh vào giờ cao điểm nhưng sau bản cập nhật vừa rồi thì chạy rất êm.",
        category: FeedbackCategory.GENERAL,
        pageUrl: "http://localhost:3000/user/promotions",
        deviceInfo: "Chrome Mobile on Samsung Galaxy S24 Ultra",
        screenResolution: "412x915",
        status: FeedbackStatus.APPROVED,
        isFeatured: false,
        adminReply: "Cảm ơn bạn Đạt đã đồng hành và phản hồi giúp hệ thống tối ưu hóa hạ tầng kết nối!",
        repliedAt: new Date(),
        isHelpfulCount: 12
      },
      {
        guestName: "Lê Minh Trí",
        guestEmail: "tri.le@hotmail.com",
        rating: 3,
        title: "Nút chọn số lượng trên iPad thi thoảng cần bấm 2 lần",
        content: "Khi dùng màn hình cảm ứng iPad xoay ngang ở chế độ Tabletop Kiosk, nút tăng số lượng món thi thoảng bị delay 0.5s. Cần tối ưu lại touch event.",
        category: FeedbackCategory.BUG_REPORT,
        pageUrl: "http://localhost:3000/kiosk",
        deviceInfo: "Mobile Safari on iPad Air 5 (iPadOS 17.4)",
        screenResolution: "820x1180",
        status: FeedbackStatus.APPROVED,
        isFeatured: false,
        adminReply: "Đội ngũ kỹ thuật đã tối ưu lại touch debounce và sửa dứt điểm hiện tượng này trong bản cập nhật V2.1. Cảm ơn bạn Trí rất nhiều!",
        repliedAt: new Date(),
        isHelpfulCount: 7
      },
      {
        guestName: "Khách hàng ẩn danh",
        rating: 2,
        title: "Cần cải thiện tốc độ tải menu khi mạng yếu 3G",
        content: "Khi đứng ở khu vực tầng hầm sóng yếu thì hình ảnh món ăn tải hơi chậm, nên dùng ảnh định dạng WebP nén nhẹ hơn.",
        category: FeedbackCategory.PERFORMANCE,
        pageUrl: "http://localhost:3000/restaurants/menu",
        deviceInfo: "Chrome 126 on Android 14",
        screenResolution: "390x844",
        status: FeedbackStatus.PENDING,
        isFeatured: false,
        isHelpfulCount: 0
      },
      {
        guestName: "Bot Quảng Cáo 123",
        guestEmail: "spam@spambot.xyz",
        rating: 1,
        title: "Dịch vụ tăng tương tác fb giá rẻ...",
        content: "Liên hệ ngay tele @spam123 để nhận ưu đãi nạp tiền cờ bạc...",
        category: FeedbackCategory.GENERAL,
        status: FeedbackStatus.SPAM,
        isFeatured: false,
        isHelpfulCount: 0
      }
    ];

    for (const f of feedbacksData) {
      await prisma.webFeedback.create({ data: f });
    }
    console.log(`✅ Đã tạo thành công ${feedbacksData.length} nhận xét đánh giá mẫu.`);
    console.log("🎉 Hoàn tất Seeding thành công!");
  } catch (error) {
    console.error("❌ Lỗi Seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedWebAuthorAndFeedback();
