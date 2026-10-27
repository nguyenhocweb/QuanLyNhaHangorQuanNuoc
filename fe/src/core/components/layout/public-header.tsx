"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NotificationBell } from "@/src/features/public/notifications/component/NotificationBell";
import { 
    BiMenu, 
    BiHomeAlt, 
    BiBuildingHouse, 
    BiRestaurant, 
    BiStar, 
    BiInfoCircle, 
    BiSupport 
} from "react-icons/bi";

const NAV_LINKS = [
    { name: "Trang chủ", href: "/", icon: BiHomeAlt },
    { name: "Thương hiệu", href: "/brands", icon: BiBuildingHouse },
    { name: "Nhà hàng", href: "/restaurants", icon: BiRestaurant },
    { name: "Đánh giá web", href: "/reviews", icon: BiStar },
    { name: "Về chúng tôi", href: "/about", icon: BiInfoCircle },
    { name: "Hỗ trợ", href: "/contact", icon: BiSupport },
] as const;
import { Div, A, Button, P } from "../ui";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

const PublicHeader = () => {
    const pathname = usePathname();
    const { user: getUser, switchWorkspace, logout, toggleMobileSidebar } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDashboardRoute =
        pathname.startsWith("/system") ||
        pathname.startsWith("/brand_owner") ||
        pathname.startsWith("/quan-ly-nha-hang") ||
        pathname.startsWith("/quan-ly-thuong-hieu") ||
        pathname.startsWith("/user");

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md"
        >
            <div className="w-full h-16 flex items-center justify-between px-3 sm:px-6 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-2 shrink-0">
                    <A href="/" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 shrink-0">
                            NVN<span className="text-orange-600">guyen</span>
                        </span>
                    </A>
                </div>

                {/* 3. Navigation Links (Chỉ hiện trên Desktop lớn, ẩn trên Mobile & Tablet) */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {NAV_LINKS.map((link) => (
                        <A href={link.href}
                            key={link.href}
                            className={[
                                "text-sm font-semibold transition-colors hover:text-orange-600 whitespace-nowrap",
                                pathname === link.href ? "text-orange-600" : "text-slate-600"

                            ].join(" ")}
                        >
                            {link.name}
                        </A>
                    ))}
                </nav>

                {/* 4. Action Buttons (Khu vực bên phải) */}
                {
                    getUser ? (
                        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={menuRef}>
                            <div className="shrink-0 flex items-center justify-center">
                                <NotificationBell />
                            </div>
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
                                >
                                    {
                                        getUser.avatar ?
                                        <div style={{ backgroundImage: `url(${getUser.avatar})` }}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-center bg-no-repeat bg-cover border border-gray-200 shrink-0"
                                        ></div>
                                        :
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shrink-0 text-xs sm:text-sm">
                                            {(getUser.name ?? getUser.user_name ?? "U").charAt(0).toUpperCase()}
                                        </div>
                                    }
                                    <p className="hidden xl:block truncate max-w-[120px] text-sm font-semibold text-gray-800 text-left">
                                        {getUser.name ?? getUser.user_name}
                                    </p>
                                </button>

                                {/* Dropdown Menu (Ảnh 2) */}
                                {isMenuOpen && (
                                    <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-3 w-[calc(100vw-1rem)] sm:w-72 max-w-xs bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                                            <p className="font-semibold text-gray-800">{getUser.name ?? getUser.user_name}</p>
                                            <p className="text-xs text-gray-500 truncate">{getUser.email}</p>
                                        </div>

                                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                            {/* Danh mục Chức năng Header (Chỉ hiện trên giao diện có nút 3 gạch: lg:hidden) */}
                                            <div className="p-2 border-b border-gray-100 lg:hidden">
                                                <p className="text-xs font-bold text-gray-400 uppercase px-3 py-1.5 flex items-center gap-1.5">
                                                    🌐 Chức năng trang web
                                                </p>
                                                <div className="flex flex-col gap-0.5">
                                                    {NAV_LINKS.map((link) => {
                                                        const Icon = link.icon;
                                                        const isActive = pathname === link.href;
                                                        return (
                                                            <Link
                                                                key={link.href}
                                                                href={link.href}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                                    isActive 
                                                                        ? "bg-orange-50 text-orange-600 font-semibold" 
                                                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                                }`}
                                                            >
                                                                <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                                                                <span>{link.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {getUser.systemRole === "Admin" ? (
                                                <div className="p-2 border-b border-gray-100">
                                                    <p className="text-xs font-bold text-red-500 uppercase px-3 py-2 flex items-center gap-1">🛠️ Quản trị viên</p>
                                                    <Link
                                                        href="/system/dashboard"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                                                    >
                                                        Dashboard Hệ Thống
                                                    </Link>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Phần Khách Hàng */}
                                                    <div className="p-2 border-b border-gray-100">
                                                        <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Khách hàng</p>
                                                        <Link href="/user/profile" onClick={() => { switchWorkspace({ type: 'CUSTOMER' }); setIsMenuOpen(false); }} className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                                                            Tài khoản của tôi
                                                        </Link>
                                                    </div>

                                                    {/* Phần Nơi làm việc */}
                                                    {( (getUser.brand && getUser.brand.length > 0) || (getUser.restaurant && getUser.restaurant.length > 0) ) && (
                                                        <div className="p-2 border-b border-gray-100">
                                                            <p className="text-xs font-bold text-indigo-400 uppercase px-3 py-2 flex items-center gap-1">🏪 Nơi làm việc</p>
                                                            
                                                            {/* Danh sách Thương hiệu */}
                                                            {getUser.brand && getUser.brand.length > 0 && getUser.brand.map((b: any) => (
                                                                <Link key={b.id} href="/brand_owner/dashboard" 
                                                                    onClick={() => { switchWorkspace({ type: 'BRAND', id: b.id, name: b.name, role: b.role }); setIsMenuOpen(false); }} 
                                                                    className="flex flex-col px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                                                                >
                                                                    <span className="font-semibold">{b.name}</span>
                                                                    <span className="text-xs text-gray-500">{b.role || "Thương hiệu"}</span>
                                                                </Link>
                                                            ))}

                                                            {/* Danh sách Chi nhánh */}
                                                            {getUser.restaurant?.map((r: any) => (
                                                                <Link key={r.id} href={(r.role === "Nhân viên") ? "/quan-ly-nha-hang/profile" : "/quan-ly-nha-hang/dashboard"} 
                                                                    onClick={() => { switchWorkspace({ type: 'RESTAURANT', id: r.id, name: r.name, role: r.role }); setIsMenuOpen(false); }} 
                                                                    className="flex flex-col px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors"
                                                                >
                                                                    <span className="font-semibold">{r.name}</span>
                                                                    <span className="text-xs text-gray-500">{r.role || "Chi nhánh"}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Đăng xuất */}
                                        <div className="p-2 bg-gray-50/50">
                                            <button onClick={() => { logout(); window.location.href = "/login"; }} className="w-full flex items-center justify-center px-3 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nút 3 gạch nằm bên phải */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (isDashboardRoute) {
                                        setIsMenuOpen(false);
                                        toggleMobileSidebar();
                                    } else {
                                        setIsMenuOpen((prev) => !prev);
                                    }
                                }}
                                className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors focus:outline-none flex items-center justify-center cursor-pointer shrink-0"
                                aria-label="Mở menu điều hướng"
                                title="Mở menu điều hướng"
                            >
                                <BiMenu className="w-6 h-6 text-2xl" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={menuRef}>
                            <div className="hidden sm:flex items-center gap-2">
                                <A href="/login" sizea="p3_2">Đăng nhập</A>
                                <A href="/register" variant="green" sizea="p4_2">Đăng ký</A>
                            </div>
                            <div className="relative lg:hidden shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen((prev) => !prev)}
                                    className="p-1.5 sm:p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors focus:outline-none flex items-center justify-center cursor-pointer shrink-0"
                                    aria-label="Menu điều hướng"
                                    title="Menu điều hướng"
                                >
                                    <BiMenu className="w-6 h-6 text-2xl" />
                                </button>

                                {isMenuOpen && (
                                    <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-auto sm:mt-3 w-[calc(100vw-1rem)] sm:w-64 max-w-xs bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-50 p-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex flex-col gap-0.5 pb-2 border-b border-gray-100">
                                            {NAV_LINKS.map((link) => {
                                                const Icon = link.icon;
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                            isActive 
                                                                ? "bg-orange-50 text-orange-600 font-semibold" 
                                                                : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                                                        }`}
                                                    >
                                                        <Icon className={`w-4 h-4 ${isActive ? "text-orange-600" : "text-gray-500"}`} />
                                                        <span>{link.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className="flex flex-col gap-2 pt-1 sm:hidden">
                                            <A href="/login" sizea="p3_2" className="w-full text-center">Đăng nhập</A>
                                            <A href="/register" variant="green" sizea="p4_2" className="w-full text-center">Đăng ký</A>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </header>
    );
};

export default PublicHeader;
