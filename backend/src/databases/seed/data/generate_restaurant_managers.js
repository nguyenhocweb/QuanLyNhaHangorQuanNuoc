import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultPasswordHash = bcrypt.hashSync("QuanLyNH@2026", 10);

// Đọc danh sách restaurants để mapping 1:1
const restaurantsPath = path.join(__dirname, "restaurants.json");
const restaurants = JSON.parse(fs.readFileSync(restaurantsPath, "utf-8"));

const firstNamesMale = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const middleNamesMale = ["Văn", "Quốc", "Minh", "Đức", "Hoàng", "Hữu", "Gia", "Thanh", "Trọng", "Đình"];
const lastNamesMale = ["Huy", "Nam", "Phong", "Dũng", "Tuấn", "Khang", "Bảo", "Long", "Thịnh", "Khoa", "Kiên", "Tài", "Phúc", "Thắng", "Quân", "Đạt"];

const firstNamesFemale = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ"];
const middleNamesFemale = ["Thị", "Ngọc", "Thanh", "Mai", "Quỳnh", "Thảo", "Kim", "Hải", "Phương", "Bích"];
const lastNamesFemale = ["Hương", "Trang", "Linh", "Anh", "Nhi", "Vy", "Hà", "Yến", "Chi", "Trâm", "Ngân", "Dung", "Thúy", "Lan", "Hạnh"];

const avatarMales = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80"
];

const avatarFemales = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80"
];

const restaurantManagers = restaurants.map((rest, index) => {
  const isFemale = index % 2 === 0;
  const gender = isFemale ? "Nu" : "Nam";
  
  const fName = isFemale ? firstNamesFemale[index % firstNamesFemale.length] : firstNamesMale[index % firstNamesMale.length];
  const mName = isFemale ? middleNamesFemale[index % middleNamesFemale.length] : middleNamesMale[index % middleNamesMale.length];
  const lName = isFemale ? lastNamesFemale[index % lastNamesFemale.length] : lastNamesMale[index % lastNamesMale.length];
  const fullName = `${fName} ${mName} ${lName}`;

  const userName = `restaurant_manager_${index + 1}`;
  const emailPrefix = userName.replace(/_/g, ".");
  const telcoPrefixes = ["090", "091", "098", "097", "093", "088", "079", "038", "039", "086"];
  const sdt = `${telcoPrefixes[index % telcoPrefixes.length]}${String(1000000 + index * 9876).padStart(7, "0")}`;

  // Trạng thái theo chi nhánh nhà hàng
  let status = "ACTIVE";
  if (rest.statusByAdmin === "PENDING") status = "PENDING";
  if (rest.statusByAdmin === "INACTIVE") status = "INACTIVE";
  if (rest.statusByAdmin === "TERMINATED") status = "BANNED";

  // Tuổi quản lý cửa hàng (từ 26 đến 42 tuổi)
  const birthYear = 1982 + (index % 16);
  const birthMonth = String((index % 12) + 1).padStart(2, "0");
  const birthDay = String((index % 28) + 1).padStart(2, "0");

  const avatar = isFemale 
    ? avatarFemales[index % avatarFemales.length] 
    : avatarMales[index % avatarMales.length];

  return {
    user_name: userName,
    email: `${emailPrefix}@nhahang.vn`,
    sdt: sdt,
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: fullName,
    avatar: status === "PENDING" && index % 2 === 0 ? null : avatar,
    gender: gender,
    date_of_birth: `${birthYear}-${birthMonth}-${birthDay}T00:00:00.000Z`,
    is_active: status,
    restaurant_name_hint: rest.name,
    branch_slug: rest.slug,
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z"
  };
});

const targetPath = path.join(__dirname, "restaurant_managers.json");
fs.writeFileSync(targetPath, JSON.stringify(restaurantManagers, null, 2), "utf-8");

console.log(`✅ Đã tạo thành công ${restaurantManagers.length} hồ sơ Quản lý nhà hàng tại ${targetPath}`);
