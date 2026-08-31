import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc danh sách Brand Managers hiện có để mapping 1:1
const brandManagersPath = path.join(__dirname, "brand_managers.json");
const brandManagers = JSON.parse(fs.readFileSync(brandManagersPath, "utf-8"));

const brandTemplatesMap = [
  { code: "TPL_BRAND_LUXURY_01", name: "Luxury Fine Dining" },
  { code: "TPL_BRAND_CASUAL_01", name: "Casual Dining Modern" },
  { code: "TPL_BRAND_FASTFOOD_01", name: "Fast Casual Street Food" },
  { code: "TPL_BRAND_CAFE_01", name: "Artisan Cafe & Bakery" }
];

const brands = brandManagers.map((bm, index) => {
  const isEnterprise = index < 10;
  const isSme = index >= 10 && index < 20;
  const isSso = index >= 20 && index < 25;
  const isEdge = index >= 25 && index < 30;
  const isPending = index >= 30 && index < 38;
  const isInactive = index >= 38 && index < 43;
  const isBanned = index >= 43;

  // Quyết định trạng thái của Brand dựa trên trạng thái của Manager
  let brandStatus = "ACTIVE";
  if (isPending) brandStatus = "PENDING";
  if (isInactive) brandStatus = "INACTIVE";
  if (isBanned) brandStatus = "TERMINATED";

  // Quyết định gói cước SaaS
  let planTier = "Cơ bản";
  if (isEnterprise) planTier = "Chuyên nghiệp";
  if (isSme) planTier = index % 2 === 0 ? "Chuyên nghiệp" : "Cơ bản";
  if (isPending) planTier = "Chuyên nghiệp"; // Đăng ký gói thử nghiệm
  if (isInactive) planTier = "Cơ bản";
  if (isBanned) planTier = "Chuyên nghiệp";

  // Template giao diện
  const selectedTemplateCode = brandTemplatesMap[index % brandTemplatesMap.length].code;

  // Tạo tên Brand và mô tả từ brand_hint
  const brandName = bm.brand_hint.split("(")[0].replace("Chain", "").replace("Holdings", "").trim();
  const taxCodeNumber = String(1000000000 + index * 12345).padStart(10, "0");

  return {
    manager_user_name: bm.user_name,
    brand_name: brandName,
    logo: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80`,
    imageMain: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80`,
    images: [
      `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80`,
      `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80`,
      `https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80`
    ],
    email_contact: bm.email,
    phone_contact: bm.sdt || "02838221199",
    description: `Hệ thống ẩm thực đẳng cấp ${brandName} - Trải nghiệm ẩm thực và dịch vụ khách hàng chuẩn mực quốc tế.`,
    tax_code: `${taxCodeNumber}`,
    link: `https://${bm.user_name.replace(/_/g, "-")}.nhahang.vn`,
    isActive: brandStatus,
    isFeatured: isEnterprise || index === 10 || index === 15,
    new: index >= 30,
    address: {
      street: `${100 + index} Đường Nguyễn Huệ`,
      ward: "Bến Nghé",
      wardCode: "790101",
      district: "Quận 1",
      districtCode: "7901",
      province: "Thành phố Hồ Chí Minh",
      provinceCode: "79",
      latitude: 10.7769 + (index * 0.001),
      longitude: 106.7009 + (index * 0.001)
    },
    taxConfig: {
      isVatInclusive: index % 2 === 0,
      defaultVatRate: 8.0, // 8% VAT chính sách Việt Nam hiện hành
      applyServiceCharge: isEnterprise,
      serviceChargeRate: isEnterprise ? 5.0 : 0.0,
      forceGlobalTaxConfig: true
    },
    inventoryConfig: {
      inventoryApprovalThreshold: isEnterprise ? 50000000 : 10000000 // Hạn mức duyệt đơn kho (50tr hoặc 10tr)
    },
    templateCode: selectedTemplateCode,
    subscription: {
      planName: planTier,
      billingCycle: "MONTHLY",
      autoRenew: !isInactive && !isBanned,
      status: isPending ? "PENDING_PAYMENT" : (isInactive ? "EXPIRED" : (isBanned ? "SUSPENDED" : "ACTIVE"))
    },
    paymentConfig: {
      momoActive: !isBanned,
      vnpayActive: !isBanned,
      isTestMode: isPending || isBanned
    },
    aiConfig: {
      isActive: isEnterprise || isSme,
      greetingMessage: `Kính chào quý khách đã đến với ${brandName}! Em là trợ lý thông minh, em có thể hỗ trợ đặt bàn hoặc xem thực đơn ngay ạ!`,
      fallbackMessage: `Dạ em xin phép ghi nhận thông tin và chuyển ngay đến Quản lý của ${brandName} để hỗ trợ quý khách ạ!`,
      agentEscalation: true
    }
  };
});

const targetPath = path.join(__dirname, "brands.json");
fs.writeFileSync(targetPath, JSON.stringify(brands, null, 2), "utf-8");

console.log(`✅ Đã tạo thành công ${brands.length} cấu hình Thương hiệu toàn diện tại ${targetPath}`);
