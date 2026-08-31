import React from "react";
import { 
    FiHome, FiCoffee, FiSun, FiHeart, FiWind, FiSmile, 
    FiLayers, FiStar, FiZap, FiGift, FiAward, FiBookmark,
    FiActivity, FiCompass, FiShield, FiTag, FiShoppingBag,
    FiCheckCircle, FiFeather, FiTrendingUp
} from "react-icons/fi";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    FiHome: <FiHome />,
    FiCoffee: <FiCoffee />,
    FiSun: <FiSun />,
    FiHeart: <FiHeart />,
    FiWind: <FiWind />,
    FiSmile: <FiSmile />,
    FiLayers: <FiLayers />,
    FiStar: <FiStar />,
    FiZap: <FiZap />,
    FiGift: <FiGift />,
    FiAward: <FiAward />,
    FiBookmark: <FiBookmark />,
    FiActivity: <FiActivity />,
    FiCompass: <FiCompass />,
    FiShield: <FiShield />,
    FiTag: <FiTag />,
    FiShoppingBag: <FiShoppingBag />,
    FiCheckCircle: <FiCheckCircle />,
    FiFeather: <FiFeather />,
    FiTrendingUp: <FiTrendingUp />,
};

export const PRESET_CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);
