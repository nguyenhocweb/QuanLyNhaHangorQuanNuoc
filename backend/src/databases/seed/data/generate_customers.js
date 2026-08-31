import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultPasswordHash = bcrypt.hashSync("KhachHang@2026", 10);

const customers = [
  // =========================================================================
  // GROUP 1: NHÓM KHÁCH HÀNG THÂN THIẾT - HOẠT ĐỘNG TÍCH CỰC (ACTIVE) - TRADITIONAL AUTH
  // =========================================================================
  {
    user_name: "nguyen_van_an_90",
    email: "an.nguyen90@gmail.com",
    sdt: "0903123456",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Nguyễn Văn An",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1990-05-15T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-01-10T08:30:00.000Z",
    updatedAt: "2026-01-15T10:20:00.000Z"
  },
  {
    user_name: "tran_thi_mai_huong",
    email: "maihuong.tran@outlook.com",
    sdt: "0912987654",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Trần Thị Mai Hương",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1993-11-20T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-02-14T09:15:00.000Z",
    updatedAt: "2026-02-10T14:30:00.000Z"
  },
  {
    user_name: "le_hoang_nam_khtn",
    email: "nam.lehoang@hcmus.edu.vn",
    sdt: "0987654321",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lê Hoàng Nam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1998-03-25T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-03-01T11:00:00.000Z",
    updatedAt: "2025-12-20T16:45:00.000Z"
  },
  {
    user_name: "pham_thuy_tien_sg",
    email: "tien.phamthuy@yahoo.com",
    sdt: "0938112233",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Phạm Thủy Tiên",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1995-08-08T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-04-12T07:45:00.000Z",
    updatedAt: "2026-01-28T09:00:00.000Z"
  },
  {
    user_name: "hoang_minh_duc_ceo",
    email: "duc.hoang@vinagroup.vn",
    sdt: "0908889900",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Hoàng Minh Đức",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1982-12-05T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-01-05T14:20:00.000Z",
    updatedAt: "2026-02-25T11:10:00.000Z"
  },
  {
    user_name: "do_ngoc_bich_foodie",
    email: "bich.foodreview@gmail.com",
    sdt: "0977334455",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đỗ Ngọc Bích",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1997-06-18T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-05-20T10:30:00.000Z",
    updatedAt: "2026-02-18T18:00:00.000Z"
  },
  {
    user_name: "vu_quoc_bao_tech",
    email: "bao.vuquoc@fpt.com",
    sdt: "0944556677",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Vũ Quốc Bảo",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1991-09-30T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-06-15T15:00:00.000Z",
    updatedAt: "2025-11-30T10:45:00.000Z"
  },
  {
    user_name: "dang_thanh_truc_mkt",
    email: "truc.dang@marketingagency.vn",
    sdt: "0966778899",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đặng Thanh Trúc",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1996-01-22T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-07-01T12:00:00.000Z",
    updatedAt: "2026-02-01T13:20:00.000Z"
  },
  {
    user_name: "bui_the_anh_designer",
    email: "anh.buithe@creative.io",
    sdt: "0922334455",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Bùi Thế Anh",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    gender: "Khac",
    date_of_birth: "1994-07-14T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-07-25T16:30:00.000Z",
    updatedAt: "2026-01-10T11:00:00.000Z"
  },
  {
    user_name: "ngo_gia_huy_hanoi",
    email: "giahuy.ngo@gmail.com",
    sdt: "0915667788",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Ngô Gia Huy",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1988-10-10T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-08-10T08:15:00.000Z",
    updatedAt: "2025-10-15T17:30:00.000Z"
  },
  {
    user_name: "duong_my_linh_dr",
    email: "mylinh.duong@hospital.vn",
    sdt: "0934998877",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Dương Mỹ Linh",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1987-04-03T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-09-05T09:40:00.000Z",
    updatedAt: "2026-02-12T15:10:00.000Z"
  },
  {
    user_name: "ly_vinh_khang_banker",
    email: "khang.lyvinh@vcb.com.vn",
    sdt: "0909112233",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lý Vĩnh Khang",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1985-02-28T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-09-20T14:50:00.000Z",
    updatedAt: "2026-01-05T10:00:00.000Z"
  },
  {
    user_name: "ha_thi_cam_tu",
    email: "camtu.ha@gmail.com",
    sdt: "0982445566",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Hà Thị Cẩm Tú",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1999-12-12T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-10-11T11:15:00.000Z",
    updatedAt: "2026-02-20T19:40:00.000Z"
  },
  {
    user_name: "dinh_tuan_kien_arch",
    email: "tuankien.dinh@architecture.com",
    sdt: "0971223344",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đinh Tuấn Kiên",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1992-08-19T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-11-01T13:00:00.000Z",
    updatedAt: "2025-12-15T08:30:00.000Z"
  },
  {
    user_name: "vo_thi_hoang_yen",
    email: "hoangyen.vo@icloud.com",
    sdt: "0918776655",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Võ Thị Hoàng Yến",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "2001-05-04T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-11-20T15:20:00.000Z",
    updatedAt: "2026-02-14T11:15:00.000Z"
  },

  // =========================================================================
  // GROUP 2: KHÁCH HÀNG ĐĂNG NHẬP OAUTH / MẠNG XÃ HỘI (GOOGLE, FACEBOOK, GITHUB)
  // =========================================================================
  {
    user_name: "google_alex_nguyen",
    email: "alex.nguyen.dev@gmail.com",
    sdt: "0931223344",
    password: null,
    providerId: "google_oauth_10928374615243",
    providerType: "GOOGLE",
    name: "Alexandre Nguyễn",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocLz34X9Y8a7b6c5d4e3f2g1h0",
    gender: "Nam",
    date_of_birth: "1996-03-12T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2026-01-20T14:00:00.000Z"
  },
  {
    user_name: "google_jessica_tran",
    email: "jessica.tran.ny@gmail.com",
    sdt: "0906778899",
    password: null,
    providerId: "google_oauth_88291039485721",
    providerType: "GOOGLE",
    name: "Jessica Trần",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocK1a2b3c4d5e6f7g8h9i0j1k2",
    gender: "Nu",
    date_of_birth: "1998-09-27T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-01-15T11:30:00.000Z",
    updatedAt: "2026-02-05T09:15:00.000Z"
  },
  {
    user_name: "google_park_minji",
    email: "minji.park.vn@gmail.com",
    sdt: "0919334455",
    password: null,
    providerId: "google_oauth_99182736451234",
    providerType: "GOOGLE",
    name: "Park Min Ji",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocM9n8b7v6c5x4z3a2s1d0f1g2",
    gender: "Nu",
    date_of_birth: "2000-02-14T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-02-01T08:45:00.000Z",
    updatedAt: "2026-02-18T16:00:00.000Z"
  },
  {
    user_name: "google_john_doe_exp",
    email: "johndoe.saigon@gmail.com",
    sdt: "0981992233",
    password: null,
    providerId: "google_oauth_77665544332211",
    providerType: "GOOGLE",
    name: "Johnathan Doe",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocP0o9i8u7y6t5r4e3w2q1a0s9",
    gender: "Nam",
    date_of_birth: "1986-07-04T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-02-10T14:20:00.000Z",
    updatedAt: "2026-01-30T10:30:00.000Z"
  },
  {
    user_name: "google_no_phone_user",
    email: "tan.pham.cloud@gmail.com",
    sdt: null, // Trường hợp Google login lần đầu chưa cập nhật SĐT
    password: null,
    providerId: "google_oauth_12345098765432",
    providerType: "GOOGLE",
    name: "Phạm Quốc Tân",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocQ1w2e3r4t5y6u7i8o9p0a1s2",
    gender: "Nam",
    date_of_birth: null, // Chưa điền ngày sinh
    is_active: "ACTIVE",
    createdAt: "2025-03-01T09:10:00.000Z",
    updatedAt: "2026-02-10T11:00:00.000Z"
  },
  {
    user_name: "google_le_thao_nhi",
    email: "thaonhi.le@gmail.com",
    sdt: "0345678901",
    password: null,
    providerId: "google_oauth_55443322110099",
    providerType: "GOOGLE",
    name: "Lê Thảo Nhi",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocZ9x8c7v6b5n4m3a2s1d0f9g8",
    gender: "Nu",
    date_of_birth: "2002-10-18T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-03-15T16:00:00.000Z",
    updatedAt: "2026-02-22T13:45:00.000Z"
  },
  {
    user_name: "fb_nguyen_thanh_ha",
    email: "thanhha.fb@facebook.com",
    sdt: "0708112233",
    password: null,
    providerId: "fb_graph_10293847561029",
    providerType: "FACEBOOK",
    name: "Nguyễn Thanh Hà",
    avatar: "https://graph.facebook.com/10293847561029/picture?type=large",
    gender: "Nu",
    date_of_birth: "1994-04-20T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-03-20T10:15:00.000Z",
    updatedAt: "2026-01-18T15:20:00.000Z"
  },
  {
    user_name: "fb_dang_van_quan",
    email: "quan.dangvan@facebook.com",
    sdt: "0799445566",
    password: null,
    providerId: "fb_graph_98765432109876",
    providerType: "FACEBOOK",
    name: "Đặng Văn Quân",
    avatar: "https://graph.facebook.com/98765432109876/picture?type=large",
    gender: "Nam",
    date_of_birth: "1991-11-11T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-04-05T14:30:00.000Z",
    updatedAt: "2026-02-12T17:00:00.000Z"
  },
  {
    user_name: "fb_vo_ngoc_lan",
    email: "ngoclan.vo.social@facebook.com",
    sdt: "0778990011",
    password: null,
    providerId: "fb_graph_55667788990011",
    providerType: "FACEBOOK",
    name: "Võ Ngọc Lan",
    avatar: "https://graph.facebook.com/55667788990011/picture?type=large",
    gender: "Nu",
    date_of_birth: "1997-08-30T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-04-18T08:00:00.000Z",
    updatedAt: "2026-01-25T11:40:00.000Z"
  },
  {
    user_name: "github_trung_engineer",
    email: "trung.dev@github.com",
    sdt: "0833112233",
    password: null,
    providerId: "gh_user_44332211",
    providerType: "GITHUB",
    name: "Trịnh Quốc Trung",
    avatar: "https://avatars.githubusercontent.com/u/44332211?v=4",
    gender: "Nam",
    date_of_birth: "1995-12-03T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-05-01T13:40:00.000Z",
    updatedAt: "2026-02-01T10:10:00.000Z"
  },
  {
    user_name: "github_anna_fullstack",
    email: "anna.le.code@github.com",
    sdt: "0855223344",
    password: null,
    providerId: "gh_user_88776655",
    providerType: "GITHUB",
    name: "Lê Anna",
    avatar: "https://avatars.githubusercontent.com/u/88776655?v=4",
    gender: "Khac",
    date_of_birth: "1998-05-19T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-05-15T09:20:00.000Z",
    updatedAt: "2026-02-15T16:30:00.000Z"
  },

  // =========================================================================
  // GROUP 3: CÁC TRƯỜNG HỢP PROFILE BIÊN ĐẶC BIỆT (EDGE CASES, LONG NAMES, LEAP DAY, DIVERSE AGES)
  // =========================================================================
  {
    user_name: "nguyen_hoang_ngoc_thao_linh_99",
    email: "thao.linh.nguyen.hoang@gmail.com",
    sdt: "0399887766",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Nguyễn Hoàng Ngọc Thảo Linh", // Tên rất dài (5 từ) để test UI vỡ layout
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1999-07-07T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2026-01-10T14:15:00.000Z"
  },
  {
    user_name: "leap_year_baby_2000",
    email: "leap.year.2000@gmail.com",
    sdt: "0388112233",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Phan Tấn Lộc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "2000-02-29T00:00:00.000Z", // Ngày nhuận 29/02 để test xử lý Date logic
    is_active: "ACTIVE",
    createdAt: "2025-06-10T11:20:00.000Z",
    updatedAt: "2026-02-20T10:00:00.000Z"
  },
  {
    user_name: "senior_customer_bac_tam",
    email: "tam.nguyen1955@yahoo.com.vn",
    sdt: "0903882211",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Nguyễn Văn Tâm", // Khách hàng cao tuổi (1955 - 71 tuổi)
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1955-08-15T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2024-05-10T08:00:00.000Z",
    updatedAt: "2025-10-10T09:00:00.000Z"
  },
  {
    user_name: "young_gen_z_student",
    email: "baoan.student2006@gmail.com",
    sdt: "0329445566",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lâm Bảo An", // Sinh viên 2006 (20 tuổi)
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "2006-09-01T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-07-01T15:30:00.000Z",
    updatedAt: "2026-02-14T19:00:00.000Z"
  },
  {
    user_name: "user_with_vietnamobile",
    email: "vnmobile.user@gmail.com",
    sdt: "0582334455", // Đầu số Vietnamobile 058
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Trương Quốc Huy",
    avatar: null, // Không có avatar
    gender: "Nam",
    date_of_birth: "1996-12-25T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-07-15T12:00:00.000Z",
    updatedAt: "2026-01-05T14:40:00.000Z"
  },
  {
    user_name: "user_gender_not_specified",
    email: "anonymous.foodie@proton.me",
    sdt: "0886778899",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Ẩn Danh Người Dùng",
    avatar: null,
    gender: null, // Giới tính để trống
    date_of_birth: null, // Ngày sinh để trống
    is_active: "ACTIVE",
    createdAt: "2025-08-01T09:00:00.000Z",
    updatedAt: "2025-08-01T09:00:00.000Z"
  },
  {
    user_name: "customer_single_letter_name",
    email: "y.doan@gmail.com",
    sdt: "0945112299",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đoàn Ý", // Tên ngắn gọn (1 chữ cái tên chính)
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1994-03-03T00:00:00.000Z",
    is_active: "ACTIVE",
    createdAt: "2025-08-15T14:10:00.000Z",
    updatedAt: "2026-02-01T16:20:00.000Z"
  },

  // =========================================================================
  // GROUP 4: TÀI KHOẢN CHỜ XÁC MINH (PENDING) - TEST FLOW ONBOARDING / OTP / ACTIVATION
  // =========================================================================
  {
    user_name: "pending_user_nguyen_kha",
    email: "kha.nguyen.pending@gmail.com",
    sdt: "0901239876",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Nguyễn Minh Kha",
    avatar: null,
    gender: "Nam",
    date_of_birth: "1997-01-15T00:00:00.000Z",
    is_active: "PENDING", // Vừa đăng ký chưa verify email
    createdAt: "2026-02-28T10:00:00.000Z",
    updatedAt: "2026-02-28T10:00:00.000Z"
  },
  {
    user_name: "pending_user_le_quynh",
    email: "quynh.le.unverified@gmail.com",
    sdt: "0918223344",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lê Quỳnh Như",
    avatar: null,
    gender: "Nu",
    date_of_birth: "2003-04-10T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-29T08:30:00.000Z",
    updatedAt: "2026-02-29T08:30:00.000Z"
  },
  {
    user_name: "pending_oauth_no_phone",
    email: "oauth.fresh.signup@gmail.com",
    sdt: null, // Chưa liên kết SĐT
    password: null,
    providerId: "google_oauth_fresh_998877",
    providerType: "GOOGLE",
    name: "Trần Bảo Ngọc",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocFreshUserAvatar001122",
    gender: null,
    date_of_birth: null,
    is_active: "PENDING", // Chờ bổ sung thông tin hồ sơ
    createdAt: "2026-02-29T14:00:00.000Z",
    updatedAt: "2026-02-29T14:00:00.000Z"
  },
  {
    user_name: "pending_user_hoang_tri",
    email: "tri.hoang.register@outlook.com",
    sdt: "0976554433",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Hoàng Minh Trí",
    avatar: null,
    gender: "Nam",
    date_of_birth: "1992-11-05T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-25T09:00:00.000Z",
    updatedAt: "2026-02-25T09:00:00.000Z"
  },
  {
    user_name: "pending_user_bui_mai",
    email: "mai.bui.2026@gmail.com",
    sdt: "0963221100",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Bùi Tuyết Mai",
    avatar: null,
    gender: "Nu",
    date_of_birth: "1998-08-22T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-26T11:45:00.000Z",
    updatedAt: "2026-02-26T11:45:00.000Z"
  },
  {
    user_name: "pending_user_dang_phuc",
    email: "phuc.dang.newbie@gmail.com",
    sdt: "0845667788",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đặng Gia Phúc",
    avatar: null,
    gender: "Nam",
    date_of_birth: "2004-06-16T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-27T16:20:00.000Z",
    updatedAt: "2026-02-27T16:20:00.000Z"
  },
  {
    user_name: "pending_user_vu_loan",
    email: "loan.vu.waiting@yahoo.com",
    sdt: "0789112233",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Vũ Kim Loan",
    avatar: null,
    gender: "Nu",
    date_of_birth: "1995-10-30T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-28T13:10:00.000Z",
    updatedAt: "2026-02-28T13:10:00.000Z"
  },
  {
    user_name: "pending_user_ngo_tien",
    email: "tien.ngo.unverified@gmail.com",
    sdt: "0367889900",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Ngô Cát Tiến",
    avatar: null,
    gender: "Khac",
    date_of_birth: "2001-01-01T00:00:00.000Z",
    is_active: "PENDING",
    createdAt: "2026-02-28T17:00:00.000Z",
    updatedAt: "2026-02-28T17:00:00.000Z"
  },

  // =========================================================================
  // GROUP 5: TÀI KHOẢN TẠM KHÓA / NGƯNG HOẠT ĐỘNG (INACTIVE) - TEST DORMANT RETENTION / REACTIVATION
  // =========================================================================
  {
    user_name: "inactive_user_ly_thu",
    email: "thu.ly.dormant@gmail.com",
    sdt: "0902113344",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lý Hoài Thu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1989-05-20T00:00:00.000Z",
    is_active: "INACTIVE", // Khách yêu cầu tạm đóng tài khoản
    createdAt: "2024-01-15T09:00:00.000Z",
    updatedAt: "2025-06-10T10:00:00.000Z"
  },
  {
    user_name: "inactive_user_phan_trung",
    email: "trung.phan.paused@gmail.com",
    sdt: "0913445566",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Phan Quang Trung",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1984-12-14T00:00:00.000Z",
    is_active: "INACTIVE",
    createdAt: "2024-02-20T11:00:00.000Z",
    updatedAt: "2025-08-15T14:30:00.000Z"
  },
  {
    user_name: "inactive_user_dinh_yen",
    email: "yen.dinh.inactive@yahoo.com",
    sdt: "0978990011",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Đinh Hải Yến",
    avatar: null,
    gender: "Nu",
    date_of_birth: "1996-03-08T00:00:00.000Z",
    is_active: "INACTIVE",
    createdAt: "2024-04-10T08:20:00.000Z",
    updatedAt: "2025-09-01T16:00:00.000Z"
  },
  {
    user_name: "inactive_user_cao_thang",
    email: "thang.cao.old@fpt.vn",
    sdt: "0935667788",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Cao Văn Thắng",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    gender: "Nam",
    date_of_birth: "1990-09-19T00:00:00.000Z",
    is_active: "INACTIVE",
    createdAt: "2024-06-05T13:40:00.000Z",
    updatedAt: "2025-11-20T09:10:00.000Z"
  },
  {
    user_name: "inactive_user_truong_vy",
    email: "vy.truong.sleep@gmail.com",
    sdt: "0766223344",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Trương Tường Vy",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
    gender: "Nu",
    date_of_birth: "1998-02-17T00:00:00.000Z",
    is_active: "INACTIVE",
    createdAt: "2024-08-18T10:15:00.000Z",
    updatedAt: "2025-12-05T11:00:00.000Z"
  },

  // =========================================================================
  // GROUP 6: TÀI KHOẢN BỊ CẤM / KHÓA VĨNH VIỄN (BANNED) - TEST SECURITY / FRAUD / BLACKLIST
  // =========================================================================
  {
    user_name: "banned_spammer_bot_01",
    email: "spambot99@fakeinbox.com",
    sdt: "0991112223",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Spam Auto Book Bot",
    avatar: null,
    gender: "Khac",
    date_of_birth: "1990-01-01T00:00:00.000Z",
    is_active: "BANNED", // Lý do: Spam đặt bàn ảo liên tục
    createdAt: "2024-03-01T02:00:00.000Z",
    updatedAt: "2024-03-05T08:00:00.000Z"
  },
  {
    user_name: "banned_fraud_loyalty_point",
    email: "fraud.loyalty.points@tempmail.org",
    sdt: "0993334445",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Trần Gian Lận Điểm",
    avatar: null,
    gender: "Nam",
    date_of_birth: "1993-07-20T00:00:00.000Z",
    is_active: "BANNED", // Lý do: Gian lận tích điểm thưởng với nhân viên thu ngân
    createdAt: "2024-05-12T14:00:00.000Z",
    updatedAt: "2024-05-20T16:30:00.000Z"
  },
  {
    user_name: "banned_abusive_reviewer",
    email: "hate.review.toxic@trashmail.com",
    sdt: "0995556667",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Lê Văn Công Kích",
    avatar: null,
    gender: "Nam",
    date_of_birth: "1988-04-12T00:00:00.000Z",
    is_active: "BANNED", // Lý do: Viết đánh giá lăng mạ, vu khống nhà hàng
    createdAt: "2024-07-10T19:00:00.000Z",
    updatedAt: "2024-07-15T11:20:00.000Z"
  },
  {
    user_name: "banned_noshow_serial_canceller",
    email: "boomhang.serial@mailnesia.com",
    sdt: "0997778889",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Hoàng No Show 10 Lần",
    avatar: null,
    gender: "Khac",
    date_of_birth: "1995-10-10T00:00:00.000Z",
    is_active: "BANNED", // Lý do: Đặt bàn tiệc VIP 10 lần liên tục nhưng không tới (No-Show)
    createdAt: "2024-09-01T10:00:00.000Z",
    updatedAt: "2024-10-01T15:00:00.000Z"
  },
  {
    user_name: "banned_chargeback_fraudster",
    email: "chargeback.thief@burnermail.io",
    sdt: "0998889990",
    password: defaultPasswordHash,
    providerId: null,
    providerType: null,
    name: "Vũ Trộm Thẻ Thanh Toán",
    avatar: null,
    gender: "Nam",
    date_of_birth: "1991-06-06T00:00:00.000Z",
    is_active: "BANNED", // Lý do: Dùng thẻ tín dụng ăn cắp để thanh toán và bị chargeback
    createdAt: "2024-11-15T21:00:00.000Z",
    updatedAt: "2024-11-20T09:00:00.000Z"
  }
];

const targetPath = path.join(__dirname, "customers.json");
fs.writeFileSync(targetPath, JSON.stringify(customers, null, 2), "utf-8");

console.log(`✅ Đã tạo thành công ${customers.length} tài khoản khách hàng tại ${targetPath}`);
