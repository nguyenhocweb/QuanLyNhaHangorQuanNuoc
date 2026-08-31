import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validator } from '@/src/core/lib/validations';
import { useAuthStore } from '@/src/features/auth/auth_store/use-auth-store';
import { createReservation_service } from '@/src/features/customer/reservation/reservation_service/createReservation_service';
import { useQueryClient } from '@tanstack/react-query';
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
    idRestaurant?: string;
    draftData: {
        date: string;
        time: string;
        endTime?: string;
        partySize: number;
        restaurantId?: string;
        idRestaurant?: string;
        selectedTable?: { id: string; name: string };
        tables?: string[];
    } | null;
    variant?: 'default' | 'luxury' | 'immersive' | 'zen' | 'hotpot' | 'sushi';
}

const BookingConfirmationModal: React.FC<Props> = ({ isOpen, onClose, idRestaurant, draftData, variant = 'default' }) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isLuxury = variant === 'luxury';
    const isImmersive = variant === 'immersive';
    const isHotpot = variant === 'hotpot' || variant === 'sushi';

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
                guest_phone: user.sdt || user.phone || "",
                guest_email: user.email || "",
                occasion: "NORMAL",
            });
        }
    }, [isOpen, user, reset]);

    if (!isOpen || !draftData) return null;

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        try {
            const finalRestaurantId = draftData.idRestaurant || draftData.restaurantId || idRestaurant;
            
            // Tính toán endTime nếu chưa có
            let finalEndTime = draftData.endTime;
            if (!finalEndTime && draftData.time) {
                const [h, m] = draftData.time.split(':').map(Number);
                let eh = (h + 2) % 24;
                finalEndTime = `${eh.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')}`;
            }

            const payload: any = {
                idRestaurant: finalRestaurantId,
                restaurantId: finalRestaurantId,
                reservation_date: draftData.date,
                start_time: draftData.time,
                end_time: finalEndTime || "22:00",
                party_size: Number(draftData.partySize),
                guest_name: data.guest_name,
                guest_phone: data.guest_phone,
                guest_email: data.guest_email || null,
                occasion: data.occasion || "NORMAL",
                special_requests: data.special_requests || null,
                dietary_restrictions: data.dietary_restrictions || null,
                tables: draftData.selectedTable?.id ? [draftData.selectedTable.id] : (draftData.tables || [])
            };

            await createReservation_service(payload);

            // Invalidate React Query cache để dữ liệu lập tức cập nhật
            queryClient.invalidateQueries({ queryKey: ['CUSTOMER_RESERVATIONS'] });
            queryClient.invalidateQueries({ queryKey: ['tables'] });

            toast.success("Đặt bàn thành công! Chúng tôi sẽ liên hệ sớm để xác nhận.");
            onClose();
        } catch (error: any) {
            console.error("Booking API Error:", error);
            toast.error(error?.response?.data?.message || error?.message || "Đặt bàn thất bại, vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200",
            isImmersive ? "bg-black/40 backdrop-blur-sm" : isHotpot ? "bg-black/80 backdrop-blur-sm" : "bg-black/70 backdrop-blur-sm"
        )}>
            <div className={cn(
                "rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans border",
                isLuxury ? "bg-[#111] border-[#333]" : 
                isImmersive ? "bg-[#001a33]/40 backdrop-blur-2xl border-white/10 text-white" :
                isHotpot ? "bg-[#1A1A1A] border-[#333333]" :
                "bg-white border-transparent"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 border-b",
                    isLuxury ? "border-[#222]" : 
                    isImmersive ? "border-white/10 bg-black/20" :
                    isHotpot ? "border-[#B71C1C] bg-[#D32F2F]" :
                    "border-gray-100"
                )}>
                    <h3 className={cn("text-xl font-bold", 
                        isLuxury ? "text-yellow-600" : 
                        isImmersive || isHotpot ? "text-white" :
                        "text-gray-800"
                    )}>Hoàn tất đặt bàn</h3>
                    <button 
                        onClick={onClose}
                        className={cn(
                            "transition-colors p-2 rounded-full",
                            isLuxury ? "text-zinc-500 hover:text-zinc-300 hover:bg-[#222]" : 
                            isImmersive ? "text-gray-400 hover:text-white hover:bg-white/10" :
                            isHotpot ? "text-white/70 hover:text-white hover:bg-[#B71C1C]" :
                            "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={cn(
                    "overflow-y-auto p-6 scrollbar-thin",
                    isLuxury ? "[color-scheme:dark] scrollbar-thumb-zinc-700 scrollbar-track-transparent" : 
                    isImmersive ? "bg-transparent [color-scheme:dark] scrollbar-thumb-white/20 scrollbar-track-transparent" :
                    isHotpot ? "[color-scheme:dark] scrollbar-thumb-[#333333] scrollbar-track-transparent" :
                    "scrollbar-thumb-gray-300"
                )}>
                    {/* Summary Card */}
                    <div className={cn(
                        "flex flex-wrap gap-4 p-4 rounded-xl border mb-8",
                        isLuxury ? "bg-[#1a1a1a] border-[#222]" : 
                        isImmersive ? "bg-white/5 border-white/10" :
                        isHotpot ? "bg-[#2D1414] border-[#4A1C1C]" :
                        "bg-indigo-50/50 border-indigo-100"
                    )}>
                        <div className={cn("flex items-center gap-2 font-medium", 
                            isLuxury ? "text-yellow-600" : 
                            isImmersive ? "text-gray-200" :
                            isHotpot ? "text-[#FFCDD2]" :
                            "text-indigo-700"
                        )}>
                            <FaRegCalendarAlt />
                            <span className={isLuxury || isImmersive || isHotpot ? "text-white" : ""}>{new Date(draftData.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className={cn("w-px hidden sm:block", 
                            isLuxury ? "bg-[#333]" : 
                            isImmersive ? "bg-white/20" :
                            isHotpot ? "bg-[#4A1C1C]" :
                            "bg-indigo-200"
                        )}></div>
                        <div className={cn("flex items-center gap-2 font-medium", 
                            isLuxury ? "text-yellow-600" : 
                            isImmersive ? "text-gray-200" :
                            isHotpot ? "text-[#FFCDD2]" :
                            "text-indigo-700"
                        )}>
                            <FaClock />
                            <span className={isLuxury || isImmersive || isHotpot ? "text-white" : ""}>{draftData.time}</span>
                        </div>
                        <div className={cn("w-px hidden sm:block", 
                            isLuxury ? "bg-[#333]" : 
                            isImmersive ? "bg-white/20" :
                            isHotpot ? "bg-[#4A1C1C]" :
                            "bg-indigo-200"
                        )}></div>
                        <div className={cn("flex items-center gap-2 font-medium", 
                            isLuxury ? "text-yellow-600" : 
                            isImmersive ? "text-gray-200" :
                            isHotpot ? "text-[#FFCDD2]" :
                            "text-indigo-700"
                        )}>
                            <FaUserFriends />
                            <span className={isLuxury || isImmersive || isHotpot ? "text-white" : ""}>{draftData.partySize} người</span>
                        </div>
                        {draftData.selectedTable && (
                            <>
                                <div className={cn("w-px hidden sm:block", 
                                    isLuxury ? "bg-[#333]" : 
                                    isImmersive ? "bg-white/20" :
                                    isHotpot ? "bg-[#4A1C1C]" :
                                    "bg-indigo-200"
                                )}></div>
                                <div className={cn("flex items-center gap-2 font-medium", 
                                    isLuxury ? "text-yellow-600" : 
                                    isImmersive ? "text-gray-200" :
                                    isHotpot ? "text-[#FFCDD2]" :
                                    "text-indigo-700"
                                )}>
                                    <span>Bàn đã chọn: <strong className={isLuxury || isImmersive || isHotpot ? "text-white" : ""}>{draftData.selectedTable.name}</strong></span>
                                </div>
                            </>
                        )}
                    </div>

                    <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Thông tin liên hệ */}
                        <div>
                            <h4 className={cn("text-sm font-bold uppercase tracking-wider mb-4", 
                                isLuxury ? "text-zinc-400" : 
                                isImmersive ? "text-gray-300" :
                                isHotpot ? "text-[#E0E0E0]" :
                                "text-gray-800"
                            )}>Thông tin liên hệ</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", 
                                        isLuxury ? "text-zinc-300" : 
                                        isImmersive || isHotpot ? "text-white" :
                                        "text-gray-700"
                                    )}>
                                        <FaUser className={isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#D32F2F]" : "text-gray-400"} /> Tên của bạn <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : isImmersive
                                                ? "border-white/20 bg-black/20 text-white focus:bg-black/40 focus:ring-1 focus:ring-white/50 focus:border-white/50 placeholder:text-gray-500"
                                                : isHotpot
                                                ? "border-[#333333] bg-[#232323] text-white focus:bg-[#2A1A1A] focus:ring-1 focus:ring-[#D32F2F] focus:border-[#D32F2F] placeholder:text-[#555555]"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập họ và tên"
                                        {...register("guest_name")}
                                    />
                                    {errors.guest_name && <p className="text-red-500 text-xs font-medium">{errors.guest_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", 
                                        isLuxury ? "text-zinc-300" : 
                                        isImmersive || isHotpot ? "text-white" :
                                        "text-gray-700"
                                    )}>
                                        <FaPhone className={isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#D32F2F]" : "text-gray-400"} /> Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : isImmersive
                                                ? "border-white/20 bg-black/20 text-white focus:bg-black/40 focus:ring-1 focus:ring-white/50 focus:border-white/50 placeholder:text-gray-500"
                                                : isHotpot
                                                ? "border-[#333333] bg-[#232323] text-white focus:bg-[#2A1A1A] focus:ring-1 focus:ring-[#D32F2F] focus:border-[#D32F2F] placeholder:text-[#555555]"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập số điện thoại"
                                        {...register("guest_phone")}
                                    />
                                    {errors.guest_phone && <p className="text-red-500 text-xs font-medium">{errors.guest_phone.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", 
                                        isLuxury ? "text-zinc-300" : 
                                        isImmersive || isHotpot ? "text-white" :
                                        "text-gray-700"
                                    )}>
                                        <FaEnvelope className={isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#D32F2F]" : "text-gray-400"} /> Email <span className={cn("font-normal", isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#888888]" : "text-gray-400")}>(Không bắt buộc)</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : isImmersive
                                                ? "border-white/20 bg-black/20 text-white focus:bg-black/40 focus:ring-1 focus:ring-white/50 focus:border-white/50 placeholder:text-gray-500"
                                                : isHotpot
                                                ? "border-[#333333] bg-[#232323] text-white focus:bg-[#2A1A1A] focus:ring-1 focus:ring-[#D32F2F] focus:border-[#D32F2F] placeholder:text-[#555555]"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        placeholder="Nhập email để nhận xác nhận"
                                        {...register("guest_email")}
                                    />
                                    {errors.guest_email && <p className="text-red-500 text-xs font-medium">{errors.guest_email.message}</p>}
                                </div>
                            </div>
                        </div>

                        <hr className={cn("border", 
                            isLuxury ? "border-[#222]" : 
                            isImmersive ? "border-white/10" :
                            isHotpot ? "border-[#333333]" :
                            "border-gray-100"
                        )} />

                        {/* Yêu cầu thêm */}
                        <div>
                            <h4 className={cn("text-sm font-bold uppercase tracking-wider mb-4", 
                                isLuxury ? "text-zinc-400" : 
                                isImmersive ? "text-gray-300" :
                                isHotpot ? "text-[#E0E0E0]" :
                                "text-gray-800"
                            )}>Tùy chọn thêm</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", 
                                        isLuxury ? "text-zinc-300" : 
                                        isImmersive || isHotpot ? "text-white" :
                                        "text-gray-700"
                                    )}>
                                        <FaHeart className={isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#D32F2F]" : "text-gray-400"} /> Dịp đặc biệt
                                    </label>
                                    <select 
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl border outline-none transition-all cursor-pointer",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : isImmersive
                                                ? "border-white/20 bg-black/20 text-white focus:bg-black/40 focus:ring-1 focus:ring-white/50 focus:border-white/50"
                                                : isHotpot
                                                ? "border-[#333333] bg-[#232323] text-white focus:bg-[#2A1A1A] focus:ring-1 focus:ring-[#D32F2F] focus:border-[#D32F2F]"
                                                : "border-gray-200 bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        )}
                                        {...register("occasion")}
                                    >
                                        <option value="NORMAL" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Dùng bữa bình thường</option>
                                        <option value="BIRTHDAY" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Sinh nhật</option>
                                        <option value="ANNIVERSARY" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Kỷ niệm</option>
                                        <option value="DATE" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Hẹn hò</option>
                                        <option value="BUSINESS" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Tiếp khách / Công việc</option>
                                        <option value="OTHER" className={isLuxury || isHotpot ? "bg-[#111]" : isImmersive ? "bg-[#001a33] text-white" : ""}>Khác</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className={cn("text-sm font-semibold flex items-center gap-2", 
                                        isLuxury ? "text-zinc-300" : 
                                        isImmersive || isHotpot ? "text-white" :
                                        "text-gray-700"
                                    )}>
                                        <FaCommentAlt className={isLuxury ? "text-zinc-500" : isImmersive ? "text-gray-400" : isHotpot ? "text-[#D32F2F]" : "text-gray-400"} /> Ghi chú cho nhà hàng
                                    </label>
                                    <textarea 
                                        className={cn(
                                            "w-full px-4 py-3 rounded-xl border outline-none transition-all resize-none",
                                            isLuxury 
                                                ? "border-[#333] bg-[#0a0a0a] text-zinc-200 focus:bg-[#1a1a1a] focus:ring-1 focus:ring-yellow-600 focus:border-yellow-600"
                                                : isImmersive
                                                ? "border-white/20 bg-black/20 text-white focus:bg-black/40 focus:ring-1 focus:ring-white/50 focus:border-white/50 placeholder:text-gray-500"
                                                : isHotpot
                                                ? "border-[#333333] bg-[#232323] text-white focus:bg-[#2A1A1A] focus:ring-1 focus:ring-[#D32F2F] focus:border-[#D32F2F] placeholder:text-[#555555]"
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
                    isLuxury ? "border-[#222] bg-[#1a1a1a]" : 
                    isImmersive ? "border-white/10 bg-black/40 backdrop-blur-md" :
                    isHotpot ? "border-[#333333] bg-[#1A1A1A]" :
                    "border-gray-100 bg-gray-50"
                )}>
                    <button 
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className={cn(
                            "px-6 py-2.5 rounded-xl font-medium border transition-colors disabled:opacity-50",
                            isLuxury 
                                ? "bg-[#222] border-[#333] text-zinc-300 hover:bg-[#333]" 
                                : isImmersive
                                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                : isHotpot
                                ? "bg-[#232323] border-[#555555] text-[#AAAAAA] hover:bg-[#333333]"
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
                                : isImmersive
                                ? "bg-white text-black shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
                                : isHotpot
                                ? "bg-[#D32F2F] text-white shadow-[0_4px_14px_0_rgba(211,47,47,0.39)] hover:shadow-[0_6px_20px_rgba(211,47,47,0.23)] hover:bg-[#B71C1C] hover:-translate-y-0.5"
                                : "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 hover:-translate-y-0.5"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <div className={cn("w-5 h-5 border-2 rounded-full animate-spin", 
                                    isLuxury ? "border-black/30 border-t-black" : 
                                    isImmersive ? "border-black/30 border-t-black" :
                                    "border-white/30 border-t-white"
                                )} />
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
