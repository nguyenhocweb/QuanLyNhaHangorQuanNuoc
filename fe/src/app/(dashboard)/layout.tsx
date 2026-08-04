"use client";
import { ReactNode } from "react";
interface PublicLayoutProps {
    children: ReactNode;
}
import { useEffect } from "react";
import PublicHeader from "@/src/core/components/layout/public-header";
import { Div } from "@/src/core/components/ui";
import PublicSidebar from "@/src/core/components/layout/public-sidebar";
import { RouteGuard } from "@/src/core/components/layout/RouteGuard";
import { useSocket } from "@/src/core/hooks/useSocket";
import axiosClient from "@/src/core/api/axios-instance";
import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { toast } from "sonner";

export default function DashboardLayout({ children }: PublicLayoutProps) {
    const { isConnected, socket } = useSocket();
    const { updateUser } = useAuthStore();

    useEffect(() => {
        if (socket && isConnected) {
            const handlePermissionUpdate = async () => {
                try {
                    const res = await axiosClient.get("/auth/loginSuccess");
                    if (res.data) {
                        updateUser(res.data);
                        toast.info("Quyền hạn của bạn vừa được cập nhật bởi Quản lý!", {
                            position: "top-center"
                        });
                    }
                } catch (error) {
                    console.error("Failed to refresh user profile", error);
                }
            };

            socket.on("permission_updated", handlePermissionUpdate);
            return () => {
                socket.off("permission_updated", handlePermissionUpdate);
            };
        }
    }, [socket, isConnected, updateUser]);

    return (
        <Div size="full_screen" vitri="col_none" className=" bg-slate-50" shape="none">
            {/* 2. Thanh điều hướng dùng chung cho mọi trang Public */}
            <PublicHeader />
            {/* 3. Phần ruột thay đổi theo từng trang (Trang chủ, Liên hệ, Giới thiệu...) */}
            {/* class "flex-1" cực kỳ quan trọng: Nó sẽ đẩy content giãn ra hết mức có thể, ép Footer chìm xuống đáy */}
            <Div vitri="col_none" size="full" className="flex flex-row"  shape="none">
                {/* ở đây 2 phần sidebar và main content */}
                {/* phần sidebar */}
              
                    <PublicSidebar />
                
                {/* phần nội dung chính */}
                <main className="flex-1 min-w-0">
                    <RouteGuard>
                        {children}
                    </RouteGuard>
                </main>
            </Div>
            {/* 4. Chân trang dùng chung */}
            {/* <PublicFooter /> */}
        </Div>
    )
}