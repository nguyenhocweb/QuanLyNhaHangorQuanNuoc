import React from 'react';
import { IOperatingHour, IPublicHoursData } from '../type/restaurant.public.type';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

interface Props {
    hoursData?: IPublicHoursData;
    variant?: 'default' | 'luxury' | 'hotpot' | 'sushi';
    layout?: 'horizontal' | 'vertical';
    isCard?: boolean;
}

const DAYS_OF_WEEK = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

const OperatingHoursTab: React.FC<Props> = ({ hoursData, variant = 'default', layout = 'horizontal', isCard = true }) => {
    const isLuxury = variant === 'luxury';
    const isHotpot = variant === 'hotpot';
    const isSushi = variant === 'sushi';

    if (!hoursData?.operating_hours || hoursData.operating_hours.length === 0) {
        return (
            <div className={`py-20 text-center ${isCard ? `rounded-2xl border ${isLuxury ? 'bg-[#111] border-[#333] shadow-black/50' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white shadow-sm border-gray-100'}` : ''}`}>
                <h3 className={`text-xl font-semibold ${isLuxury ? 'text-yellow-600' : isHotpot || isSushi ? 'text-[#D32F2F]' : 'text-gray-700'}`}>Chưa có thông tin giờ hoạt động</h3>
                <p className={`mt-2 ${isLuxury ? 'text-zinc-500' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-500'}`}>Nhà hàng chưa cập nhật lịch hoạt động chi tiết.</p>
            </div>
        );
    }

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return "";
        return timeStr.slice(0, 5);
    };

    return (
        <div className={isCard ? `rounded-2xl border p-6 md:p-8 ${isLuxury ? 'bg-[#111] border-[#333] shadow-black/50' : isHotpot || isSushi ? 'bg-transparent border-none p-0' : 'bg-white border-gray-100 shadow-sm'}` : ''}>
            {isCard && (
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-800'}`}>
                    <FaClock className={isLuxury ? "text-yellow-600" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-indigo-600"} />
                    Lịch hoạt động
                </h2>
            )}
            
            <div className={layout === 'vertical' ? "flex flex-col-reverse gap-8" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
                <div>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isLuxury ? 'text-zinc-300' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-700'}`}>
                        <FaCalendarAlt className={isLuxury ? "text-zinc-500" : isHotpot || isSushi ? "text-[#D32F2F]" : "text-gray-400"} />
                        Giờ mở cửa hàng tuần
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6, 0].map((displayIndex) => {
                            const dayName = DAYS_OF_WEEK[displayIndex];
                            const dayData = hoursData.operating_hours.find(h => h.day_of_week === displayIndex);
                            const currentDay = new Date().getDay();
                            const isToday = displayIndex === currentDay;

                            return (
                                <div 
                                    key={displayIndex} 
                                    className={`flex items-center justify-between p-3 rounded-xl border ${
                                        isToday 
                                            ? (isLuxury ? 'border-yellow-600/50 bg-[#222]' : isHotpot || isSushi ? 'border-[#4A1C1C] bg-[#2D1414]' : 'border-indigo-200 bg-indigo-50/50') 
                                            : (isLuxury ? 'border-[#222] bg-[#1a1a1a]' : isHotpot || isSushi ? 'border-[#333333] bg-[#1A1A1A]' : 'border-gray-100 bg-gray-50/50')
                                    }`}
                                >
                                    <span className={`font-medium ${
                                        isToday 
                                            ? (isLuxury ? 'text-yellow-500' : isHotpot || isSushi ? 'text-[#FFCDD2]' : 'text-indigo-700') 
                                            : (isLuxury ? 'text-zinc-300' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-700')
                                    }`}>
                                        {dayName} {isToday && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isLuxury ? 'bg-[#333] text-yellow-600' : isHotpot || isSushi ? 'bg-[#4A1C1C] text-[#FFCDD2]' : 'bg-indigo-100 text-indigo-700'}`}>Hôm nay</span>}
                                    </span>
                                    
                                    {!dayData || dayData.is_closed ? (
                                        <span className={`text-sm font-semibold ${isLuxury ? 'text-zinc-600' : isHotpot || isSushi ? 'text-gray-500' : 'text-gray-400'}`}>Đóng cửa</span>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-bold ${isLuxury ? 'text-zinc-200' : isHotpot || isSushi ? 'text-[#F5F5F5]' : 'text-gray-700'}`}>
                                                {formatTime(dayData.open_time)} - {formatTime(dayData.close_time)}
                                            </span>
                                            {dayData.break_start && dayData.break_end && (
                                                <span className={`text-xs mt-0.5 ${isLuxury ? 'text-zinc-500' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-500'}`}>
                                                    Nghỉ: {formatTime(dayData.break_start)} - {formatTime(dayData.break_end)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div className={`rounded-xl p-6 border ${isLuxury ? 'bg-[#1a1a1a] border-[#222]' : isHotpot || isSushi ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-gray-50 border-gray-100'}`}>
                        <h3 className={`text-lg font-semibold mb-2 ${isLuxury ? 'text-zinc-300' : isHotpot || isSushi ? 'text-[#E0E0E0]' : 'text-gray-700'}`}>Lưu ý</h3>
                        <ul className={`list-disc list-inside space-y-2 text-sm ${isLuxury ? 'text-zinc-400' : isHotpot || isSushi ? 'text-[#AAAAAA]' : 'text-gray-600'}`}>
                            <li>Giờ nhận đặt bàn cuối cùng thường sớm hơn giờ đóng cửa 45 phút.</li>
                            <li>Vào các ngày Lễ/Tết, giờ hoạt động có thể thay đổi. Vui lòng liên hệ trực tiếp để biết thêm chi tiết.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatingHoursTab;
