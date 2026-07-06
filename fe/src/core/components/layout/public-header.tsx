"use client"
import { usePathname } from "next/navigation";

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
    const getUser = useAuthStore((state) => state.user);
    console.log(getUser);

    const linkClick: Record<string, string> = {
        "Khách hàng": "/user/profile",
        "Admin": "/system/dashboard",
        "Quản lý thương hiệu": "/brand/dashboard",        // Đổi lại URL nếu cần
        "Quản lý nhà hàng": "/restaurant/dashboard",      // Đổi lại URL nếu cần
        "Nhân viên": "/staff/dashboard",                  // Đổi lại URL nếu cần
        "login": "/login"
    };

    const userRole = getUser?.role || "login"; // Giả sử đây là một biến any từ đâu đó

    // Ép kiểu trực tiếp lúc truy xuất
    const redirectUrl = linkClick[userRole] || "/"

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
                        <Div>
                            <A href={redirectUrl} className="flex items-center">
                                {
                                    getUser.avatar &&
                                    <Div style={{ backgroundImage: `url(${getUser.avatar})` }}
                                        shape="circle"
                                        className="w-10 h-10 bg-center bg-no-repeat bg-cover"
                                    ></Div>
                                }
                                <P variant="truncate_1line" className="w-30">{getUser.name ?? getUser.user_name}</P>
                            </A>
                        </Div>
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