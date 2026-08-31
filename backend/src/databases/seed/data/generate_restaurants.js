import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc danh sách Brand đã tạo
const brandsPath = path.join(__dirname, "brands.json");
const brands = JSON.parse(fs.readFileSync(brandsPath, "utf-8"));

const cities = [
  { city: "Hồ Chí Minh", provinceCode: "79", district: "Quận 1", districtCode: "7901", ward: "Bến Nghé", wardCode: "790101", lat: 10.7769, lng: 106.7009 },
  { city: "Hà Nội", provinceCode: "01", district: "Hoàn Kiếm", districtCode: "0101", ward: "Tràng Tiền", wardCode: "010101", lat: 21.0285, lng: 105.8542 },
  { city: "Đà Nẵng", provinceCode: "48", district: "Hải Châu", districtCode: "4801", ward: "Hải Châu 1", wardCode: "480101", lat: 16.0544, lng: 108.2022 },
  { city: "Lâm Đồng", provinceCode: "68", district: "TP. Đà Lạt", districtCode: "6801", ward: "Phường 1", wardCode: "680101", lat: 11.9404, lng: 108.4583 },
  { city: "Khánh Hòa", provinceCode: "56", district: "TP. Nha Trang", districtCode: "5601", ward: "Lộc Thọ", wardCode: "560101", lat: 12.2388, lng: 109.1967 }
];

const restaurants = [];
let managerIndex = 1;

brands.forEach((brand, bIndex) => {
  const isEnterprise = bIndex < 10;
  const branchCount = isEnterprise ? 2 : 1; // Doanh nghiệp lớn có 2 chi nhánh, SME có 1 chi nhánh

  for (let branch = 1; branch <= branchCount; branch++) {
    const loc = cities[(bIndex + branch) % cities.length];
    const branchSuffix = branch === 1 ? `Chi nhánh ${loc.district} - ${loc.city}` : `Chi nhánh Landmark Center - ${loc.city}`;
    const restName = `${brand.brand_name} - ${branchSuffix}`;
    const slug = `${brand.brand_name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${loc.district.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${branch}`.replace(/-+/g, "-");

    const managerUserName = `restaurant_manager_${managerIndex}`;
    managerIndex++;

    restaurants.push({
      brand_name: brand.brand_name,
      manager_user_name: managerUserName,
      name: restName,
      slug: slug,
      logo: brand.logo,
      imageMain: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80`,
      images: [
        `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80`,
        `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80`
      ],
      city: loc.city,
      address: {
        street: `${15 + branch * 10} Đường Lê Lợi, Phường ${loc.ward}`,
        ward: loc.ward,
        wardCode: loc.wardCode,
        district: loc.district,
        districtCode: loc.districtCode,
        province: loc.city,
        provinceCode: loc.provinceCode,
        latitude: loc.lat + (branch * 0.002),
        longitude: loc.lng + (branch * 0.002)
      },
      email_contact: `contact.${slug}@nhahang.vn`,
      phone_contact: `028${String(38000000 + bIndex * 100 + branch).padStart(8, "0")}`,
      description: `Chi nhánh ${restName} tọa lạc tại vị trí đắc địa trung tâm ${loc.city}, không gian sang trọng, dịch vụ chuyên nghiệp.`,
      statusByAdmin: brand.isActive,
      statusByBrand: brand.isActive,
      isNew: bIndex >= 30,
      weightedScore: 4.6 + ((bIndex % 5) * 0.08),
      ratingStats: {
        totalRating: 120 + (bIndex * 15),
        averageRating: 4.7,
        food: 4.8,
        service: 4.6,
        ambiance: 4.7
      },
      bookingConfig: {
        maxPartySize: isEnterprise ? 30 : 15,
        bookingWindowDays: 30,
        cancellationHours: 2,
        depositRequired: isEnterprise,
        depositAmount: isEnterprise ? 200000 : 0
      },
      taxConfig: brand.taxConfig,
      inventoryConfig: brand.inventoryConfig,
      areas: [
        {
          name: "Sảnh Chính Tầng Trệt",
          description: "Khu vực bàn ăn tiêu chuẩn, máy lạnh thoáng mát",
          smoking_allowed: false,
          is_outdoor: false,
          floor_number: 1,
          is_active: "ACTIVE"
        },
        {
          name: "Phòng VIP Riêng Tư",
          description: "Phòng tiệc khép kín dành cho gia đình & tiếp khách đối tác",
          smoking_allowed: false,
          is_outdoor: false,
          floor_number: 2,
          is_active: "ACTIVE"
        },
        {
          name: "Sân Thượng Rooftop View Đẹp",
          description: "Không gian mở thoáng đãng nhìn ra toàn cảnh thành phố",
          smoking_allowed: true,
          is_outdoor: true,
          floor_number: 3,
          is_active: "ACTIVE"
        }
      ],
      operating_hours: [
        { day_of_week: 1, open_time: "10:00", close_time: "22:30", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 2, open_time: "10:00", close_time: "22:30", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 3, open_time: "10:00", close_time: "22:30", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 4, open_time: "10:00", close_time: "22:30", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 5, open_time: "10:00", close_time: "23:00", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 6, open_time: "09:30", close_time: "23:30", is_closed: false, break_start: null, break_end: null },
        { day_of_week: 0, open_time: "09:30", close_time: "23:00", is_closed: false, break_start: null, break_end: null }
      ],
      special_schedules: [
        {
          schedule_type: "SPECIAL_HOURS",
          reason: "Phục vụ Lễ Hội Ẩm Thực & Quốc Khánh",
          open_time: "09:00",
          close_time: "23:45",
          is_closed: false
        }
      ]
    });
  }
});

const targetPath = path.join(__dirname, "restaurants.json");
fs.writeFileSync(targetPath, JSON.stringify(restaurants, null, 2), "utf-8");

console.log(`✅ Đã tạo thành công ${restaurants.length} chi nhánh Nhà hàng toàn diện tại ${targetPath}`);
