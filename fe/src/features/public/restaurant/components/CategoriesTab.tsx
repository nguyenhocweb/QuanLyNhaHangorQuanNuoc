import React from 'react';
import { IPublicRestaurantCore } from '../type/restaurant.public.type';
import { FaTags } from 'react-icons/fa';

interface Props {
    categories: IPublicRestaurantCore['categories'];
    variant?: 'default' | 'luxury' | 'hotpot' | 'sushi';
}

const applyLuxuryOpacity = (color: string, opacity: number = 0.15) => {
    if (!color) return color;
    
    // Nếu màu đã có độ mờ sẵn (rgba, hsla, hoặc hex 8 ký tự/5 ký tự)
    if (color.startsWith('rgba') || color.startsWith('hsla') || (color.startsWith('#') && (color.length === 9 || color.length === 5))) {
        return color;
    }
    
    // Nếu là mã Hex 6 hoặc 3 ký tự
    if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return color;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Nếu là rgb(...)
    if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }
    
    return color;
};

const CategoriesTab: React.FC<Props> = ({ categories, variant = 'default' }) => {
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot';
    const isSushi = variant === 'sushi';

    if (!categories || categories.length === 0) {
        return (
            <div className={`py-20 text-center rounded-2xl border ${isLuxury ? 'bg-[#111] border-[#333] shadow-black/50' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white shadow-sm border-gray-100'}`}>
                <h3 className={`text-xl font-semibold ${isLuxury ? 'text-yellow-600' : isHotpot || isSushi ? 'text-[#D32F2F]' : 'text-gray-700'}`}>Chưa có danh mục nào</h3>
                <p className={`mt-2 ${isLuxury ? 'text-zinc-500' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-500'}`}>Nhà hàng này chưa thiết lập danh mục món ăn.</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border p-6 md:p-8 ${isLuxury ? 'bg-[#111] border-[#333] shadow-black/50' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>
                <FaTags className={isLuxury ? "text-yellow-600" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-indigo-600"} />
                Danh mục nổi bật
            </h2>
            
            <div className="flex flex-wrap gap-4">
                {categories.map((c) => {
                    const bgColor = c.bgColor || (isLuxury || isHotpot || isSushi ? '#1a1a1a' : '#f3f4f6');
                    const textColor = c.textColor || (isLuxury || isHotpot || isSushi ? '#d4d4d8' : '#374151');
                    
                    return (
                        <div 
                            key={c.id} 
                            className={`px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-md hover:-translate-y-0.5 border ${
                                isLuxury ? 'border-yellow-600/30' : isHotpot || isSushi ? 'border-[#444444] hover:border-[#D32F2F]/50' : 'shadow-sm border-white/20'
                            }`}
                            style={{
                                backgroundColor: isLuxury || isHotpot || isSushi ? applyLuxuryOpacity(bgColor, isHotpot || isSushi ? 0.2 : 0.15) : bgColor,
                                color: isLuxury ? (textColor === '#ffffff' || textColor === '#fff' ? '#fbbf24' : textColor) : isHotpot || isSushi ? (textColor === '#ffffff' || textColor === '#fff' ? '#E0E0E0' : textColor) : textColor
                            }}
                        >
                            {c.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesTab;
