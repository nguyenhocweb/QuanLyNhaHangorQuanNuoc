"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";
import { TiltCard3D } from "../animation/TiltCard3D";
import FadeIn from "../animation/FadeIn";
import { toast } from "sonner";
import { 
    FaPhoneAlt, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaFacebookF, 
    FaTiktok, 
    FaYoutube, 
    FaInstagram, 
    FaCommentDots, 
    FaPaperPlane, 
    FaApple, 
    FaGooglePlay, 
    FaArrowRight, 
    FaShieldAlt, 
    FaCheckCircle, 
    FaCrown, 
    FaHeart
} from "react-icons/fa";

const PublicFooter: React.FC = () => {
    const { is3D } = usePerformanceMode();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            toast.error("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Đăng ký nhận đặc quyền VIP thành công! Cảm ơn bạn đã đồng hành cùng NVNguyen.");
            setEmail("");
        }, 800);
    };

    return (
        <footer className="w-full relative bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-950 text-slate-300 overflow-hidden border-t border-indigo-500/20">
            {/* ==================== HÀO QUANG NỀN 3D (3D GLOWING AURAS) ==================== */}
            {is3D && (
                <>
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                    <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                    {/* Grid Mesh pattern phía dưới nền */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-16 relative z-10 flex flex-col gap-16">
                {/* ==================== THẺ 3D NEWSLETTER GLASSMORPHISM ==================== */}
                <FadeIn className="w-full">
                    <TiltCard3D depth={8} glareOpacity={0.15} className="w-full rounded-3xl">
                        <div className="w-full p-8 sm:p-10 lg:p-12 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            {/* Hào quang mini trong card */}
                            <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex flex-col gap-3 text-center lg:text-left max-w-2xl relative z-10">
                                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                                    <FaCrown className="text-amber-400 text-sm animate-bounce" />
                                    <span>Đặc Quyền Thành Viên VIP 2026</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                    Đăng ký Nhận <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Voucher & Ưu Đãi</span> Độc Quyền
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Cập nhật xu hướng ẩm thực tinh hoa, trải nghiệm đặt bàn ưu tiên và các chương trình khuyến mãi giảm đến 50% từ hệ thống thương hiệu đối tác TOP 1.
                                </p>
                            </div>

                            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 relative z-10 flex-shrink-0 max-w-md lg:max-w-none">
                                <div className="w-full sm:w-72 relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email của bạn..."
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900/80 border border-white/15 text-white placeholder-slate-500 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                                >
                                    <span>{isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}</span>
                                    <FaPaperPlane className="text-xs" />
                                </button>
                            </form>
                        </div>
                    </TiltCard3D>
                </FadeIn>

                {/* ==================== BỐ CỤC 4 CỘT NỘI DUNG CHUYÊN SÂU ==================== */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 border-b border-white/10 pb-16">
                    {/* Cột 1: Thương hiệu & Liên hệ Hotline VIP (Chiếm 4 cột trên LG) */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <Link href="/" className="flex items-center gap-2.5 group w-fit">
                            <span className="text-3xl font-black tracking-tight text-white transition-transform group-hover:scale-105 duration-300">
                                NVN<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400">guyen</span>
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
                                PRO MAX
                            </span>
                        </Link>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                            Hệ thống quản lý đặt bàn và chuỗi nhà hàng đa thương hiệu cao cấp chuẩn quốc tế. Nơi hội tụ hương vị đỉnh cao và công nghệ quản trị ẩm thực tối ưu.
                        </p>

                        {/* Huy hiệu TOP 1 Platform */}
                        <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                            <FaCrown className="text-amber-400 text-sm" />
                            <span className="text-xs font-bold text-slate-200">🏆 Top 1 Platform Ẩm Thực Việt Nam 2026</span>
                        </div>

                        {/* Danh sách Liên hệ Hotline / Email */}
                        <div className="flex flex-col gap-3 pt-2">
                            <a 
                                href="tel:0935884541" 
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-white hover:border-purple-400 transition-all duration-300 group w-fit shadow-md hover:shadow-purple-500/20 hover:-translate-y-0.5"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                                    <FaPhoneAlt className="text-sm animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">Hotline VIP Hỗ trợ 24/7</span>
                                    <span className="text-base font-black tracking-wide text-white group-hover:text-purple-300 transition-colors">0935.884.541</span>
                                </div>
                            </a>

                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <FaEnvelope className="text-amber-400 flex-shrink-0" />
                                <span>Email: <strong className="text-white">support@nvnguyen.com</strong></span>
                            </div>

                            <div className="flex items-start gap-3 text-xs text-slate-400">
                                <FaMapMarkerAlt className="text-rose-400 flex-shrink-0 mt-0.5" />
                                <span>Trụ sở chính: <strong className="text-white">Hệ thống NVNguyen, TP. Hồ Chí Minh & Hà Nội</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Cột 2: Khám Phá Ẩm Thực (Chiếm 3 cột trên LG) */}
                    <div className="lg:col-span-3 flex flex-col gap-4 lg:pl-4">
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-l-2 border-purple-500 pl-3">
                            Khám Phá Ẩm Thực
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                            {[
                                { name: "Thương hiệu Đối tác VIP", href: "/brands" },
                                { name: "Nhà hàng Được Yêu Thích", href: "/restaurants" },
                                { name: "Thực đơn & Món ăn Đặc sắc", href: "/dishes" },
                                { name: "Đặt bàn Trực tuyến Nhanh", href: "/restaurants" },
                                { name: "Chương trình Ưu đãi VIP", href: "/promotions" },
                                { name: "Cộng đồng Đánh giá Ẩm thực", href: "#" }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link 
                                        href={item.href} 
                                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 py-0.5 w-fit"
                                    >
                                        <FaArrowRight className="text-[10px] text-purple-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Đối Tác & Hỗ Trợ (Chiếm 2 cột trên LG) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-l-2 border-indigo-500 pl-3">
                            Hợp Tác & Pháp Lý
                        </h4>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                            {[
                                { name: "Hợp tác Nhượng quyền", href: "#" },
                                { name: "Đăng ký Mở nhà hàng", href: "#" },
                                { name: "Trung tâm Đối tác NVN", href: "#" },
                                { name: "Chính sách Bảo mật", href: "#" },
                                { name: "Điều khoản Sử dụng", href: "#" },
                                { name: "Câu hỏi Thường gặp (FAQ)", href: "#" }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link 
                                        href={item.href} 
                                        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 py-0.5 w-fit"
                                    >
                                        <FaArrowRight className="text-[10px] text-indigo-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 4: Hệ Sinh Thái & Tải Ứng Dụng (Chiếm 3 cột trên LG) */}
                    <div className="lg:col-span-3 flex flex-col gap-5">
                        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-l-2 border-pink-500 pl-3">
                            Kết Nối & Ứng Dụng
                        </h4>

                        {/* Cụm nút Mạng xã hội 3D Floating Badges */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-400 font-medium">Theo dõi chúng tôi trên mạng xã hội:</span>
                            <div className="flex items-center gap-2.5 flex-wrap pt-1">
                                {[
                                    { icon: FaFacebookF, name: "Facebook", bgHover: "hover:bg-[#1877F2]/20 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:shadow-[#1877F2]/30" },
                                    { icon: FaTiktok, name: "TikTok", bgHover: "hover:bg-white/20 hover:text-white hover:border-white/50 hover:shadow-white/20" },
                                    { icon: FaYoutube, name: "YouTube", bgHover: "hover:bg-[#FF0000]/20 hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:shadow-[#FF0000]/30" },
                                    { icon: FaInstagram, name: "Instagram", bgHover: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/50 hover:shadow-pink-500/30" },
                                    { icon: FaCommentDots, name: "Zalo", bgHover: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-blue-500/30" }
                                ].map((soc, idx) => {
                                    const IconComponent = soc.icon;
                                    return (
                                        <a
                                            key={idx}
                                            href="#"
                                            title={soc.name}
                                            className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${soc.bgHover}`}
                                        >
                                            <IconComponent className="text-base" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Khối Tải ứng dụng (App Download Preview) */}
                        <div className="flex flex-col gap-2.5 pt-2">
                            <span className="text-xs text-slate-400 font-medium">Trải nghiệm đặt bàn siêu tốc trên App:</span>
                            <div className="grid grid-cols-2 gap-2.5">
                                <a 
                                    href="#" 
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                                >
                                    <FaApple className="text-2xl text-white group-hover:text-purple-400 transition-colors flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400 uppercase font-semibold">Download on the</span>
                                        <span className="text-xs font-bold text-white">App Store</span>
                                    </div>
                                </a>

                                <a 
                                    href="#" 
                                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                                >
                                    <FaGooglePlay className="text-xl text-emerald-400 flex-shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-slate-400 uppercase font-semibold">GET IT ON</span>
                                        <span className="text-xs font-bold text-white">Google Play</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== THANH ĐÁY (BOTTOM BAR & TRUST BADGES) ==================== */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 pt-2">
                    {/* Trạng thái hệ thống realtime giả lập */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Hệ thống hoạt động ổn định 99.99%</span>
                        </div>
                        <span className="hidden sm:inline text-slate-600">|</span>
                        <span className="hidden sm:inline">Phiên bản v3.2.0-PRO</span>
                    </div>

                    {/* Bản quyền & Designed by */}
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
                        <span>© 2026 <strong>NVNguyen</strong>. Bảo lưu mọi quyền.</span>
                        <span className="hidden sm:inline text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                            Designed with <FaHeart className="text-rose-500 text-[10px] animate-pulse" /> & Precision in Vietnam 🇻🇳
                        </span>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:border-purple-500/40 transition-colors">
                            <FaShieldAlt className="text-purple-400" /> DMCA PROTECTED
                        </div>
                        <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:border-emerald-500/40 transition-colors">
                            <FaCheckCircle className="text-emerald-400" /> PCI DSS SECURE
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;