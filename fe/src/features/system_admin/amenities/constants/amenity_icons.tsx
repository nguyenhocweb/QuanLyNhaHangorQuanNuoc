import React from "react";
import { 
  FiWifi, FiCoffee, FiWind, FiVideo, FiMusic, 
  FiCreditCard, FiMonitor, FiMapPin, FiHeart, 
  FiStar, FiSmile, FiShield, FiBriefcase, FiUsers,
  FiTruck, FiInfo, FiSun, FiMoon, FiCloud, FiHome,
  FiCheckCircle, FiBox, FiTag
} from "react-icons/fi";
import { 
  FaWifi, FaCar, FaParking, FaMotorcycle, FaCreditCard, 
  FaSnowflake, FaCrown, FaChild, FaBaby, FaSmokingBan, 
  FaSmoking, FaMusic, FaTv, FaBeer, FaCocktail, 
  FaWineGlass, FaUtensils, FaPaw, FaWheelchair, FaClock, 
  FaCoffee, FaTree, FaCamera, FaConciergeBell, FaGift, 
  FaSwimmingPool, FaShoppingBag, FaShieldAlt
} from "react-icons/fa";

export const AMENITY_ICONS: Record<string, React.ReactElement> = {
  // FontAwesome Icons (Pre-seeded in Master Data)
  FaWifi: <FaWifi />,
  FaCar: <FaCar />,
  FaParking: <FaParking />,
  FaMotorcycle: <FaMotorcycle />,
  FaCreditCard: <FaCreditCard />,
  FaSnowflake: <FaSnowflake />,
  FaCrown: <FaCrown />,
  FaChild: <FaChild />,
  FaBaby: <FaBaby />,
  FaSmokingBan: <FaSmokingBan />,
  FaSmoking: <FaSmoking />,
  FaMusic: <FaMusic />,
  FaTv: <FaTv />,
  FaBeer: <FaBeer />,
  FaCocktail: <FaCocktail />,
  FaWineGlass: <FaWineGlass />,
  FaUtensils: <FaUtensils />,
  FaPaw: <FaPaw />,
  FaWheelchair: <FaWheelchair />,
  FaClock: <FaClock />,
  FaCoffee: <FaCoffee />,
  FaTree: <FaTree />,
  FaCamera: <FaCamera />,
  FaConciergeBell: <FaConciergeBell />,
  FaGift: <FaGift />,
  FaSwimmingPool: <FaSwimmingPool />,
  FaShoppingBag: <FaShoppingBag />,
  FaShieldAlt: <FaShieldAlt />,

  // Feather Icons
  FiWifi: <FiWifi />,
  FiCoffee: <FiCoffee />,
  FiWind: <FiWind />,
  FiVideo: <FiVideo />,
  FiMusic: <FiMusic />,
  FiCreditCard: <FiCreditCard />,
  FiMonitor: <FiMonitor />,
  FiMapPin: <FiMapPin />,
  FiHeart: <FiHeart />,
  FiStar: <FiStar />,
  FiSmile: <FiSmile />,
  FiShield: <FiShield />,
  FiBriefcase: <FiBriefcase />,
  FiUsers: <FiUsers />,
  FiTruck: <FiTruck />,
  FiInfo: <FiInfo />,
  FiSun: <FiSun />,
  FiMoon: <FiMoon />,
  FiCloud: <FiCloud />,
  FiHome: <FiHome />,
  FiCheckCircle: <FiCheckCircle />,
  FiBox: <FiBox />,
  FiTag: <FiTag />
};

export const PRESET_ICON_NAMES = Object.keys(AMENITY_ICONS);

export const PRESET_CATEGORIES: { category: string; icons: string[] }[] = [
  {
    category: "Phổ biến & Tiện nghi",
    icons: ["FaWifi", "FaSnowflake", "FaCrown", "FaCar", "FaParking", "FaMotorcycle", "FaCreditCard"]
  },
  {
    category: "Gia đình & Giải trí",
    icons: ["FaChild", "FaBaby", "FaMusic", "FaTv", "FaCamera", "FaTree", "FaSwimmingPool", "FaPaw"]
  },
  {
    category: "Ẩm thực & Đồ uống",
    icons: ["FaCoffee", "FaUtensils", "FaBeer", "FaCocktail", "FaWineGlass", "FaShoppingBag"]
  },
  {
    category: "Dịch vụ & Tiêu chuẩn",
    icons: ["FaConciergeBell", "FaWheelchair", "FaSmokingBan", "FaSmoking", "FaClock", "FaShieldAlt", "FaGift"]
  }
];

export const getAmenityIcon = (iconName?: string, className: string = ""): React.ReactElement => {
  if (!iconName) {
    return <span className={`inline-flex items-center justify-center ${className}`.trim()}><FiTag /></span>;
  }

  const iconElement = AMENITY_ICONS[iconName];
  if (iconElement) {
    return <span className={`inline-flex items-center justify-center ${className}`.trim()}>{iconElement}</span>;
  }

  // Fallback if icon name is unknown
  return <span className={`inline-flex items-center justify-center ${className}`.trim()}><FiStar /></span>;
};
