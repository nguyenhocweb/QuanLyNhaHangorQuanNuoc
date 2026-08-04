"use client"

import { SidebarMenuQuanLyNhaHang } from "./public-sidebar";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/src/core/components/ui";

export const RouteGuard = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, activeWorkspace, user } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        let allowed = true;

        if (pathname.startsWith("/brand_owner")) {
            if (user?.role !== "Chủ thương hiệu" && user?.role !== "Quản lý thương hiệu") {
                allowed = false;
            } else if (activeWorkspace?.type === "RESTAURANT" || activeWorkspace?.type === "CUSTOMER") {
                allowed = false;
            }
        } else if (pathname.startsWith("/quan-ly-nha-hang")) {
            if (user?.role === "Khách hàng" || user?.role === "Admin") {
                allowed = false;
            } else if (activeWorkspace?.type === "BRAND" || activeWorkspace?.type === "CUSTOMER") {
                allowed = false;
            } else {
                // Kiểm tra quyền theo từng trang nếu là nhân viên
                if (user?.role !== "Quản lý nhà hàng" && user?.role !== "Chủ thương hiệu" && user?.role !== "Admin" && user?.role !== "Quản lý thương hiệu") {
                    const matchedMenu = SidebarMenuQuanLyNhaHang.find(item => pathname.startsWith(item.link));
                    if (matchedMenu && matchedMenu.permissions && matchedMenu.permissions.length > 0) {
                        const userPerms = user?.permissions || [];
                        const hasPermission = matchedMenu.permissions.some(p => userPerms.includes(p));
                        if (!hasPermission) {
                            allowed = false; // Chặn truy cập trực tiếp bằng link nếu không có quyền
                        }
                    }
                }
            }
        } else if (pathname.startsWith("/system")) {
             if (user?.role !== "Admin") {
                 allowed = false;
             }
        }

        setIsAllowed(allowed);
    }, [pathname, activeWorkspace, isAuthenticated, router, user, mounted]);

    if (!mounted) return null;
    if (isAllowed === null) return null; // đang kiểm tra

    if (!isAllowed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="text-6xl mb-6">🚫</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Không tìm thấy trang hoặc Không có quyền truy cập</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Rất tiếc, đường dẫn bạn đang cố truy cập không tồn tại hoặc bạn không có đủ quyền hạn để xem trang này trong không gian làm việc hiện tại.
                </p>
                <Button 
                    variant="green" 
                    sizea="p3_2"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-xl shadow-sm text-white"
                >
                    Quay lại trang trước
                </Button>
            </div>
        );
    }

    return <>{children}</>;
};
