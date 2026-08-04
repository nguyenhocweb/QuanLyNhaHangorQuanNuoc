import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import { cn } from '@/src/core/lib/tw';

interface BookingDraft {
    date: string;
    time: string;
    endTime: string;
    partySize: number;
    bookingType: 'AUTO' | 'MANUAL';
}

interface Props {
    onContinue: (draft: BookingDraft) => void;
    variant?: 'default' | 'luxury';
}

const BookingWidget: React.FC<Props> = ({ onContinue, variant = 'default' }) => {
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [partySize, setPartySize] = useState<string>('2');
    const [bookingType, setBookingType] = useState<'AUTO' | 'MANUAL'>('AUTO');

    const isLuxury = variant === 'luxury';

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStartTime = e.target.value;
        setTime(newStartTime);
        
        if (newStartTime) {
            const [hours, minutes] = newStartTime.split(':').map(Number);
            let endHours = hours + 2;
            if (endHours >= 24) endHours -= 24;
            setEndTime(`${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        }
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue({
            date,
            time,
            endTime,
            partySize: parseInt(partySize, 10),
            bookingType
        });
    };

    return (
        <div className={cn(
            "rounded-2xl overflow-hidden",
            isLuxury 
                ? "bg-[#111] border border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
                : "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
        )}>
            {/* Header */}
            <div className={cn(
                "px-6 py-4",
                isLuxury ? "bg-[#1a1a1a] border-b border-[#333] text-yellow-500" : "bg-indigo-600 text-white"
            )}>
                <h3 className="text-xl font-bold">Đặt Bàn Ngay</h3>
                <p className={cn("text-sm mt-1", isLuxury ? "text-zinc-400" : "text-indigo-100")}>Giữ chỗ trước để có trải nghiệm tốt nhất</p>
            </div>

            {/* Form Content */}
            <div className="p-6">
                <form onSubmit={handleContinue} className="space-y-5">
                    {/* Booking Type Selector */}
                    <div className={cn("flex p-1 rounded-xl", isLuxury ? "bg-[#222]" : "bg-gray-100")}>
                        <button
                            type="button"
                            onClick={() => setBookingType('AUTO')}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                                bookingType === 'AUTO' 
                                    ? (isLuxury ? "bg-[#333] shadow-sm text-yellow-500" : "bg-white shadow-sm text-indigo-600") 
                                    : (isLuxury ? "text-zinc-400 hover:text-zinc-200" : "text-gray-500 hover:text-gray-700")
                            )}
                        >
                            Xếp bàn tự động
                        </button>
                        <button
                            type="button"
                            onClick={() => setBookingType('MANUAL')}
                            className={cn(
                                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                                bookingType === 'MANUAL' 
                                    ? (isLuxury ? "bg-[#333] shadow-sm text-yellow-500" : "bg-white shadow-sm text-indigo-600") 
                                    : (isLuxury ? "text-zinc-400 hover:text-zinc-200" : "text-gray-500 hover:text-gray-700")
                            )}
                        >
                            Tự chọn bàn
                        </button>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label className={cn("block text-sm font-semibold mb-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>Ngày đến</label>
                        <div className="relative">
                            <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", isLuxury ? "text-zinc-500" : "text-gray-400")}>
                                <FaCalendarAlt />
                            </div>
                            <input 
                                type="date" 
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                                    isLuxury 
                                        ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#111] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                                        : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Time Picker */}
                        <div>
                            <label className={cn("block text-sm font-semibold mb-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>Giờ đến</label>
                            <div className="relative">
                                <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", isLuxury ? "text-zinc-500" : "text-gray-400")}>
                                    <FaClock />
                                </div>
                                <select 
                                    required
                                    value={time}
                                    onChange={handleTimeChange}
                                    className={cn(
                                        "w-full pl-10 pr-8 py-3 rounded-xl border outline-none transition-all appearance-none cursor-pointer",
                                        isLuxury 
                                            ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#111] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600" 
                                            : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    )}
                                >
                                    <option value="" disabled hidden>Chọn giờ</option>
                                    <option value="17:00">17:00</option>
                                    <option value="17:30">17:30</option>
                                    <option value="18:00">18:00</option>
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                    <option value="20:00">20:00</option>
                                    <option value="20:30">20:30</option>
                                    <option value="21:00">21:00</option>
                                </select>
                            </div>
                        </div>

                        {/* End Time Picker */}
                        <div>
                            <label className={cn("block text-sm font-semibold mb-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>Giờ về (dự kiến)</label>
                            <div className="relative">
                                <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", isLuxury ? "text-zinc-500" : "text-gray-400")}>
                                    <FaClock />
                                </div>
                                <select 
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className={cn(
                                        "w-full pl-10 pr-8 py-3 rounded-xl border outline-none transition-all appearance-none cursor-pointer",
                                        isLuxury 
                                            ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#111] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600" 
                                            : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    )}
                                >
                                    <option value="" disabled hidden>Chọn giờ</option>
                                    <option value="18:00">18:00</option>
                                    <option value="18:30">18:30</option>
                                    <option value="19:00">19:00</option>
                                    <option value="19:30">19:30</option>
                                    <option value="20:00">20:00</option>
                                    <option value="20:30">20:30</option>
                                    <option value="21:00">21:00</option>
                                    <option value="21:30">21:30</option>
                                    <option value="22:00">22:00</option>
                                    <option value="22:30">22:30</option>
                                    <option value="23:00">23:00</option>
                                    <option value="23:30">23:30</option>
                                </select>
                            </div>
                        </div>

                        {/* Party Size */}
                        <div className="col-span-2">
                            <label className={cn("block text-sm font-semibold mb-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>Số người</label>
                            <div className="relative">
                                <div className={cn("absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", isLuxury ? "text-zinc-500" : "text-gray-400")}>
                                    <FaUserFriends />
                                </div>
                                <select 
                                    required
                                    value={partySize}
                                    onChange={(e) => setPartySize(e.target.value)}
                                    className={cn(
                                        "w-full pl-10 pr-8 py-3 rounded-xl border outline-none transition-all appearance-none cursor-pointer",
                                        isLuxury 
                                            ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#111] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600" 
                                            : "border-gray-200 bg-gray-50 text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    )}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(num => (
                                        <option key={num} value={num}>{num} người</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className={cn(
                                "w-full font-bold py-3.5 px-4 rounded-xl flex justify-center items-center gap-2 transition-all duration-200",
                                isLuxury 
                                    ? "bg-yellow-600 text-black shadow-[0_4px_14px_0_rgba(202,138,4,0.39)] hover:shadow-[0_6px_20px_rgba(202,138,4,0.23)] hover:bg-yellow-500 hover:-translate-y-0.5" 
                                    : "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 hover:-translate-y-0.5"
                            )}
                        >
                            {bookingType === 'AUTO' ? 'Xác nhận đặt bàn' : 'Tiếp tục (Chọn Bàn)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingWidget;
