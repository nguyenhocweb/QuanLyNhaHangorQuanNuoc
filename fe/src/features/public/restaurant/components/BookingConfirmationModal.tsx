import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validator } from '@/src/core/lib/validations';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { toast } from 'sonner';
import { FaTimes, FaUser, FaPhone, FaEnvelope, FaRegCalendarAlt, FaClock, FaUserFriends, FaCommentAlt, FaHeart } from 'react-icons/fa';
import { cn } from '@/src/core/lib/tw';

const bookingSchema = z.object({
    guest_name: validator.string("Họ và tên"),
    guest_phone: validator.phone(),
    guest_email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    occasion: z.enum(["NORMAL", "BIRTHDAY", "ANNIVERSARY", "BUSINESS", "DATE", "OTHER"]).optional(),
    special_requests: z.string().optional(),
    dietary_restrictions: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    draftData: {
        date: string;
        time: string;
        endTime: string;
        partySize: number;
    } | null;
    variant?: 'default' | 'luxury';
}

const BookingConfirmationModal: React.FC<Props> = ({ isOpen, onClose, draftData, variant = 'default' }) => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isLuxury = variant === 'luxury';

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema) as any,
        defaultValues: {
            guest_name: "",
            guest_phone: "",
            guest_email: "",
            occasion: "NORMAL",
            special_requests: "",
            dietary_restrictions: ""
        }
    });

    useEffect(() => {
        if (isOpen && user) {
            reset({
                guest_name: user.name || "",
                guest_phone: user.sdt || "",
                guest_email: user.email || "",
                occasion: "NORMAL",
            });
        }
    }, [isOpen, user, reset]);

    if (!isOpen || !draftData) return null;

    const onSubmit = (data: BookingFormValues) => {
        setIsSubmitting(true);
        const payload = {
            ...draftData,
            end_time: draftData.endTime,
            ...data
        };

        // TODO: Call API with payload
        console.log("Booking Payload:", payload);

        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Đặt bàn thành công! Chúng tôi sẽ liên hệ sớm để xác nhận.");
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans",
                isLuxury ? "bg-[#111] border border-[#333]" : "bg-white"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 border-b",
                    isLuxury ? "border-[#222]" : "border-gray-100"
                )}>
                    <h3 className={cn("text-xl font-bold", isLuxury ? "text-yellow-600" : "text-gray-800")}>Hoàn tất đặt bàn</h3>
                    <button 
                        onClick={onClose}
                        className={cn(
                            "transition-colors p-2 rounded-full",
                            isLuxury ? "text-zinc-500 hover:text-zinc-300 hover:bg-[#222]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={cn(
                    "overflow-y-auto p-6 scrollbar-thin",
                    isLuxury ? "[color-scheme:dark] scrollbar-thumb-zinc-700 scrollbar-track-transparent" : "scrollbar-thumb-gray-300"
                )}>
                    {/* Summary Card */}
                    <div className={cn(
                        "flex flex-wrap gap-4 p-4 rounded-xl border mb-8",
                        isLuxury ? "bg-[#1a1a1a] border-[#222]" : "bg-indigo-50/50 border-indigo-100"
                    )}>
                        <div className={cn("flex items-center gap-2 font-medium", isLuxury ? "text-yellow-600" : "text-indigo-700")}>
                            <FaRegCalendarAlt />
                            <span className={isLuxury ? "text-zinc-200" : ""}>{new Date(draftData.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className={cn("w-px hidden sm:block", isLuxury ? "bg-[#333]" : "bg-indigo-200")}></div>
                        <div className={cn("flex items-center gap-2 font-medium", isLuxury ? "text-yellow-600" : "text-indigo-700")}>
                            <FaClock />
                            <span className={isLuxury ? "text-zinc-200" : ""}>{draftData.time}</span>
                        </div>
                        <div className={cn("w-px hidden sm:block", isLuxury ? "bg-[#333]" : "bg-indigo-200")}></div>
                        <div className={cn("flex items-center gap-2 font-medium", isLuxury ? "text-yellow-600" : "text-indigo-700")}>
                            <FaUserFriends />
                            <span className={isLuxury ? "text-zinc-200" : ""}>{draftData.partySize} người</span>
                        </div>
                    </div>

                    <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Thông tin liên hệ */}
                        <div>
                            <h4 className={cn("text-sm font-bold uppercase tracking-wider mb-4", isLuxury ? "text-zinc-400" : "text-gray-800")}>Thông tin liên hệ</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>
                                        <FaUser className={isLuxury ? "text-zinc-500" : "text-gray-400"} /> Tên của bạn <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập họ và tên"
                                        {...register("guest_name")}
                                    />
                                    {errors.guest_name && <p className="text-red-500 text-xs font-medium">{errors.guest_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>
                                        <FaPhone className={isLuxury ? "text-zinc-500" : "text-gray-400"} /> Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập số điện thoại"
                                        {...register("guest_phone")}
                                    />
                                    {errors.guest_phone && <p className="text-red-500 text-xs font-medium">{errors.guest_phone.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>
                                        <FaEnvelope className={isLuxury ? "text-zinc-500" : "text-gray-400"} /> Email <span className={cn("font-normal", isLuxury ? "text-zinc-500" : "text-gray-400")}>(Không bắt buộc)</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập email để nhận xác nhận"
                                        {...register("guest_email")}
                                    />
                                    {errors.guest_email && <p className="text-red-500 text-xs font-medium">{errors.guest_email.message}</p>}
                                </div>
                            </div>
                        </div>

                        <hr className={cn("border", isLuxury ? "border-[#222]" : "border-gray-100")} />

                        {/* Yêu cầu thêm */}
                        <div>
                            <h4 className={cn("text-sm font-bold uppercase tracking-wider mb-4", isLuxury ? "text-zinc-400" : "text-gray-800")}>Tùy chọn thêm</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>
                                        <FaHeart className={isLuxury ? "text-zinc-500" : "text-gray-400"} /> Dịp đặc biệt
                                    </label>
                                    <select 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all cursor-pointer",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        {...register("occasion")}
                                    >
                                        <option value="NORMAL" className={isLuxury ? "bg-[#111]" : ""}>Dùng bữa bình thường</option>
                                        <option value="BIRTHDAY" className={isLuxury ? "bg-[#111]" : ""}>Sinh nhật</option>
                                        <option value="ANNIVERSARY" className={isLuxury ? "bg-[#111]" : ""}>Kỷ niệm</option>
                                        <option value="DATE" className={isLuxury ? "bg-[#111]" : ""}>Hẹn hò</option>
                                        <option value="BUSINESS" className={isLuxury ? "bg-[#111]" : ""}>Tiếp khách / Công việc</option>
                                        <option value="OTHER" className={isLuxury ? "bg-[#111]" : ""}>Khác</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", isLuxury ? "text-zinc-300" : "text-gray-700")}>
                                        <FaCommentAlt className={isLuxury ? "text-zinc-500" : "text-gray-400"} /> Ghi chú cho nhà hàng
                                    </label>
                                    <textarea 
                                        className={cn(
                                            "w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        rows={3}
                                        placeholder="Bạn có yêu cầu ghế trẻ em, dị ứng thức ăn, hay vị trí ngồi cụ thể không?"
                                        {...register("special_requests")}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className={cn(
                    "border-t p-6 flex justify-end gap-3 flex-shrink-0",
                    isLuxury ? "border-[#222] bg-[#1a1a1a]" : "border-gray-100 bg-gray-50"
                )}>
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-medium border transition-colors disabled:opacity-50",
                            isLuxury 
                                ? "bg-[#222] border-[#333] text-zinc-300 hover:bg-[#333]" 
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        form="booking-form"
                        disabled={isSubmitting}
                        className={cn(
                            "px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all duration-200 disabled:opacity-70",
                            isLuxury 
                                ? "bg-yellow-600 text-black shadow-[0_4px_14px_0_rgba(202,138,4,0.39)] hover:shadow-[0_6px_20px_rgba(202,138,4,0.23)] hover:bg-yellow-500 hover:-translate-y-0.5"
                                : "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 hover:-translate-y-0.5"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={cn("w-5 h-5 border-2 rounded-full animate-spin", isLuxury ? "border-black/30 border-t-black" : "border-white/30 border-t-white")} />
                                Đang xử lý...
                            </>
                        ) : "Xác nhận đặt bàn"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationModal;
