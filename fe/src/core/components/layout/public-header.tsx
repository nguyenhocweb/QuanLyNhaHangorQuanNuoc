"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { NotificationBell } from "@/src/features/public/notifications/component/NotificationBell";
const NAV_LINKS = [
    { name: "Trang chủ", href: "/" },
    { name: "Thương hiệu", href: "/brands" },
    { name: "Nhà hàng", href: "/restaurants" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
] as const;
import { Div, A, Button, P } from "../ui";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";

const PublicHeader = () => {
    const pathname = usePathname();
    const { user: getUser, switchWorkspace, logout } = useAuthStore();
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

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md "
        >
            <Div size="h16" className="justify-between px-4">
                {/* logo */}
                <A href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <span className="text-2xl font-black tracking-tight text-slate-900">
                        NVN<span className="text-orange-600">guyen</span>
                    </span>
                </A>
                {/* 3. Navigation Links (Chỉ hiện trên Desktop, ẩn trên Mobile) */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <A href={link.href}
                            key={link.href}
                            className={[
                                "text-sm font-semibold transition-colors hover:text-orange-600",
                                pathname === link.href ? "text-orange-600" : "text-slate-600"

                            ].join(" ")}
                        >
                            {link.name}
                        </A>
                    ))}
                </nav>
                {/* 4. Action Buttons (Khu vực bên phải) */}
                {
                    getUser ?
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                                {
                                    getUser.avatar ?
                                    <div style={{ backgroundImage: `url(${getUser.avatar})` }}
                                        className="w-10 h-10 rounded-full bg-center bg-no-repeat bg-cover border border-gray-200"
                                    ></div>
                                    :
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                        {(getUser.name ?? getUser.user_name ?? "U").charAt(0).toUpperCase()}
                                    </div>
                                }
                                <p className="truncate w-30 text-sm font-semibold text-gray-800 text-left">{getUser.name ?? getUser.user_name}</p>
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                                        <p className="font-semibold text-gray-800">{getUser.name ?? getUser.user_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{getUser.email}</p>
                                    </div>

                                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {getUser.systemRole === "Admin" ? (
                                            <div className="p-2 border-b border-gray-100">
                                                <p className="text-xs font-bold text-red-500 uppercase px-3 py-2 flex items-center gap-1">🛠️ Quản trị viên</p>
                                                <a href="/system/dashboard" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors">
                                                    Dashboard Hệ Thống
                                                </a>
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
                                        <button onClick={() => { logout(); window.location.href = "/login"; }} className="w-full flex items-center justify-center px-3 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors">
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    :
                    <Div gap="g3_4">
                            <A href="/login" sizea="p3_2">Đăng nhập</A>
                            <A href="/register" variant="green" sizea="p4_2">Đăng ký</A>
                        </Div>

                }
            </Div>

        </header>
    )
}
export default PublicHeader
