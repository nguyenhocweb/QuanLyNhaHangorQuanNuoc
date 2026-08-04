import React from "react";
import { 
    FiWifi, FiCoffee, FiWind, FiVideo, FiMusic, 
    FiCreditCard, FiMonitor, FiMapPin, FiHeart, 
    FiStar, FiSmile, FiShield, FiBriefcase, FiUsers,
    FiTruck, FiInfo, FiSun, FiMoon, FiCloud, FiHome
} from "react-icons/fi";

export const AMENITY_ICONS: Record<string, React.ReactNode> = {
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
};

export const PRESET_ICON_NAMES = Object.keys(AMENITY_ICONS);
