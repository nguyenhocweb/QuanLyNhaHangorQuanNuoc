"use client"
import { BsPersonFill } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsCalendar2Minus } from "react-icons/bs";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { BsBag } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { MdOutlineLogout } from "react-icons/md";


import {
    MdOutlineDashboard, MdOutlineRestaurantMenu, MdOutlineTableRestaurant,
    MdOutlineSettings, MdCategory, MdOutlineSoupKitchen, MdStore, MdCardMembership,
    MdPayment
} from "react-icons/md";
import { FiUsers, FiMap, FiClock, FiX } from "react-icons/fi";
import { BsShop, BsClipboardData, BsReceipt, BsCalendar2Check } from "react-icons/bs";
import { RiAdminLine, RiBillLine, RiCoupon3Line } from "react-icons/ri";
import { BiBuildingHouse, BiSupport, BiMessageSquareDetail, BiKey } from "react-icons/bi";
import { FaTabletAlt, FaCommentDots, FaUsers as FaTeamUsers, FaHeadset } from "react-icons/fa";

// 1. TÁC NHÂN: SYSTEM ADMIN (Quản trị viên hệ thống NVNguyen)
// Mục tiêu: Giám sát tenant (Brand), user global và master data. Không can thiệp kinh doanh.
export const SidebarMenuSystemAdmin = [
    { stt: 1, name: "Tổng quan", link: "/system/dashboard", icon: <MdOutlineDashboard className="text-xl" /> },
    { stt: 2, name: "Hồ sơ cá nhân", link: "/system/profile", icon: <BsPersonFill className="text-xl" /> },
    { stt: 2.5, name: "Thông báo", link: "/system/notifications", icon: <IoIosNotificationsOutline className="text-xl" /> },
    { stt: 3, name: "Quản lý Thương hiệu", link: "/system/brands", icon: <BiBuildingHouse className="text-xl" /> },
    { stt: 4, name: "Yêu cầu Đối tác", link: "/system/upgrade-requests", icon: <FiUsers className="text-xl" /> },
    { stt: 5, name: "Quản lý Gói cước", link: "/system/subscriptions", icon: <MdCardMembership className="text-xl" /> },
    { stt: 6, name: "Gói dịch vụ & Thanh toán", link: "/system/billing", icon: <RiBillLine className="text-xl" /> },
    { stt: 7, name: "Phương thức thanh toán", link: "/system/payment-methods", icon: <MdPayment className="text-xl" /> },
    { stt: 8, name: "Quản lý Nhà hàng", link: "/system/restaurants", icon: <MdStore className="text-xl" /> },
    { stt: 9, name: "Tài khoản toàn cục", link: "/system/users", icon: <FiUsers className="text-xl" /> },
    { stt: 10, name: "Danh mục chuẩn", link: "/system/categories", icon: <MdCategory className="text-xl" /> }, // Thể loại nhà hàng (Lẩu, Nướng...)
    { stt: 11, name: "Quản lý Tiện ích", link: "/system/amenities", icon: <MdCategory className="text-xl" /> },
    { stt: 12, name: "Quản lý Thẻ (Tags)", link: "/system/tags", icon: <MdCategory className="text-xl" /> },
    { stt: 13, name: "Quản lý Đánh giá", link: "/system/reviews", icon: <CiStar className="text-xl" /> },
    { stt: 13.1, name: "Góp ý Website", link: "/system/web-feedback", icon: <FaCommentDots className="text-xl" /> },
    { stt: 13.2, name: "Đội ngũ Web", link: "/system/web-author", icon: <FaTeamUsers className="text-xl" /> },
    { stt: 13.3, name: "Phiếu Hỗ Trợ CSKH", link: "/system/contact-ticket", icon: <FaHeadset className="text-xl" /> },
    { stt: 14, name: "Quản lý Mẫu giao diện", link: "/system/templates", icon: <MdOutlineDashboard className="text-xl" /> },

    { stt: 15, name: "Quản lý API Key", link: "/system/api-keys", icon: <BiKey className="text-xl" /> },
    { stt: 16, name: "Cài đặt hệ thống", link: "/system/settings", icon: <MdOutlineSettings className="text-xl" /> },
];

const SidebarMenuCustomer = [
    { stt: 1, name: "Hồ sơ cá nhân", link: "/user/profile", icon: <BsPersonFill className="text-xl" /> },
    { stt: 2, name: "Thẻ Thành Viên", link: "/user/loyalty", icon: <MdCardMembership className="text-xl" /> },
    { stt: 3, name: "Thông báo", link: "/user/notifications", icon: <IoIosNotificationsOutline className="text-xl" /> },
    { stt: 4, name: "Lịch sử đặt bàn", link: "/user/reservations", icon: <BsCalendar2Minus className="text-lg" /> },
    { stt: 5, name: "Đơn hàng của tôi", link: "/user/orders", icon: <BsBag className="text-lg" /> },
    { stt: 6, name: "Ví Voucher", link: "/user/promotions", icon: <RiCoupon3Line className="text-lg" /> },
    { stt: 7, name: "Hóa đơn", link: "/user/invoices", icon: <LiaFileInvoiceSolid className="text-xl" /> },
    { stt: 8, name: "Đánh giá", link: "/user/reviews", icon: <CiStar className="text-lg" /> },
];

// 3. TÁC NHÂN: BRAND OWNER (Chủ thương hiệu)
// Mục tiêu: Quản lý tổng thể thương hiệu, các chi nhánh (nhà hàng), thực đơn chung, nhân sự cấp cao.
export const SidebarMenuBrandOwner = [
    { stt: 1, name: "Tổng quan", link: "/brand_owner/dashboard", icon: <MdOutlineDashboard className="text-xl" /> },
    { stt: 2, name: "Hồ sơ cá nhân", link: "/brand_owner/profile", icon: <BsPersonFill className="text-xl" /> },
    { stt: 2.5, name: "Thông báo", link: "/brand_owner/notifications", icon: <IoIosNotificationsOutline className="text-xl" /> },
    { stt: 3, name: "Thương hiệu của tôi", link: "/brand_owner/my-brand", icon: <BiBuildingHouse className="text-xl" /> },
    { stt: 4, name: "Quản lý Chi nhánh", link: "/brand_owner/restaurants", icon: <MdStore className="text-xl" /> },
    { stt: 5, name: "Quản lý Thực đơn", link: "/brand_owner/menus", icon: <MdOutlineRestaurantMenu className="text-xl" /> }, // Core Base
    { stt: 6, name: "Kho Hàng", link: "/brand_owner/inventory", icon: <BsShop className="text-xl" />, featureKey: "CENTRAL_SUPPLY_CHAIN" },
    { stt: 7, name: "Quản lý Nhân viên", link: "/brand_owner/staffs", icon: <FiUsers className="text-xl" /> }, // Core Base
    { stt: 8, name: "Khách hàng & CRM", link: "/brand_owner/crm", icon: <BsPersonFill className="text-xl" />, featureKey: "CRM_MANAGEMENT" },
    { stt: 9, name: "Chương trình Khuyến mãi", link: "/brand_owner/promotions", icon: <RiCoupon3Line className="text-xl" />, featureKey: "ADVANCED_PROMOTIONS" },
    { stt: 10, name: "Báo cáo Doanh thu", link: "/brand_owner/reports", icon: <BsClipboardData className="text-xl" />, featureKey: "REVENUE_ANALYTICS" },
    { stt: 11, name: "Đánh giá từ khách", link: "/brand_owner/reviews", icon: <CiStar className="text-xl" /> }, // Core Base
    { stt: 12, name: "Gói cước & Thanh toán", link: "/brand_owner/billing", icon: <BsReceipt className="text-xl" /> },
    { stt: 13, name: "Tích hợp API Key", link: "/brand_owner/api-keys", icon: <BiKey className="text-xl" /> },
    { stt: 13.5, name: "Cổng thanh toán & Ngân hàng", link: "/brand_owner/payment-configs", icon: <MdPayment className="text-xl" /> },
    { stt: 14, name: "Cài đặt Thương hiệu", link: "/brand_owner/settings", icon: <MdOutlineSettings className="text-xl" /> },
];

// 4. TÁC NHÂN: QUẢN LÝ NHÀ HÀNG
export const SidebarMenuQuanLyNhaHang = [
    { stt: 1, name: "Tổng quan", link: "/quan-ly-nha-hang/dashboard", icon: <MdOutlineDashboard className="text-xl" />, permissions: ["MANAGER_ONLY"] },
    { stt: 2, name: "Hồ sơ cá nhân", link: "/quan-ly-nha-hang/profile", icon: <BsPersonFill className="text-xl" />, permissions: [] },
    { stt: 2.5, name: "Thông báo", link: "/quan-ly-nha-hang/notifications", icon: <IoIosNotificationsOutline className="text-xl" />, permissions: [] },
    { stt: 3, name: "Sơ đồ Bàn", link: "/quan-ly-nha-hang/tables", icon: <MdOutlineTableRestaurant className="text-xl" />, permissions: ["VIEW_TABLES", "MANAGE_TABLES"] }, // Core Base
    { stt: 3.5, name: "Cài đặt Tablet Bàn", link: "/quan-ly-nha-hang/table-kiosk", icon: <FaTabletAlt className="text-xl" />, permissions: ["VIEW_TABLES", "MANAGE_TABLES"] },
    { stt: 4, name: "Quản lý Đặt bàn", link: "/quan-ly-nha-hang/reservations", icon: <BsCalendar2Check className="text-xl" />, permissions: ["VIEW_RESERVATION", "CREATE_RESERVATION", "UPDATE_RESERVATION", "CANCEL_RESERVATION", "ASSIGN_RESERVATION_TABLE"] }, // Core Base
    { stt: 5, name: "Quản lý Đơn hàng", link: "/quan-ly-nha-hang/orders", icon: <BsBag className="text-xl" />, permissions: ["VIEW_ORDER", "CREATE_ORDER", "UPDATE_ORDER", "CANCEL_ORDER", "APPLY_DISCOUNT"] }, // Core Base
    { stt: 6, name: "Thu ngân & Thanh toán", link: "/quan-ly-nha-hang/cashier", icon: <MdPayment className="text-xl" />, permissions: ["PROCESS_PAYMENT", "REFUND_PAYMENT", "VIEW_TRANSACTIONS"] },
    { stt: 7, name: "Màn hình Bếp/Bar", link: "/quan-ly-nha-hang/kitchen", icon: <MdOutlineSoupKitchen className="text-xl" />, permissions: ["VIEW_KITCHEN_TICKETS", "UPDATE_KITCHEN_STATUS"], featureKey: "KITCHEN_DISPLAY" },
    { stt: 8, name: "Thực đơn chi nhánh", link: "/quan-ly-nha-hang/menus", icon: <MdOutlineRestaurantMenu className="text-xl" />, permissions: ["VIEW_MENU", "UPDATE_MENU_AVAILABILITY"] }, // Core Base
    { stt: 9, name: "Kho & Nguyên liệu", link: "/quan-ly-nha-hang/inventory", icon: <BsShop className="text-xl" />, permissions: ["VIEW_INVENTORY", "UPDATE_INVENTORY"], featureKey: "LOCAL_INVENTORY" },
    { stt: 10, name: "Quản lý Nhân sự", link: "/quan-ly-nha-hang/staffs", icon: <FiUsers className="text-xl" />, permissions: ["VIEW_STAFF", "MANAGE_STAFF", "MANAGE_ROSTERS"] }, // Core Base
    { stt: 11, name: "Khách hàng CRM", link: "/quan-ly-nha-hang/crm", icon: <FiUsers className="text-xl" />, permissions: ["MANAGER_ONLY"], featureKey: "CRM_MANAGEMENT" },
    { stt: 12, name: "Khuyến mãi", link: "/quan-ly-nha-hang/promotions", icon: <RiCoupon3Line className="text-xl" />, permissions: ["MANAGE_PROMOTIONS"], featureKey: "ADVANCED_PROMOTIONS" },
    { stt: 13, name: "Báo cáo Doanh thu", link: "/quan-ly-nha-hang/reports", icon: <BsClipboardData className="text-xl" />, permissions: ["VIEW_REVENUE_REPORT", "VIEW_STAFF_REPORT"], featureKey: "REVENUE_ANALYTICS" },
    { stt: 14, name: "Đánh giá từ khách", link: "/quan-ly-nha-hang/reviews", icon: <CiStar className="text-xl" />, permissions: ["MANAGE_REVIEWS"] }, // Core Base
    { stt: 15, name: "Giờ hoạt động", link: "/quan-ly-nha-hang/operating-hours", icon: <FiClock className="text-xl" />, permissions: ["VIEW_OPERATING_HOURS", "UPDATE_OPERATING_HOURS"] },
    { stt: 16, name: "Cài đặt Chi nhánh", link: "/quan-ly-nha-hang/settings", icon: <MdOutlineSettings className="text-xl" />, permissions: ["MANAGE_RESTAURANT"] },
];

import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { A, Button, Div, H, P } from "../ui";
import { usePathname } from "next/navigation";
import { ConfirmModal } from "./public-ConfirmModal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { UpgradeBrandAccountModal } from "@/src/features/customer/profile/components/UpgradeBrandAccountModal";
import { FeatureGate } from "@/src/core/components/ui/FeatureGate";
import { useGetMyBrandSubscription } from "@/src/features/brand_owner/my_brand/hook/useGetMyBrandSubscription";

interface SidebarContentProps {
    user: any;
    activeWorkspace: any;
    pathname: string;
    mySubscription: any;
    onNavigate?: () => void;
    onOpenUpgradeModal: () => void;
    onOpenUpgradePrompt: () => void;
    onOpenLogoutModal: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
    user,
    activeWorkspace,
    pathname,
    mySubscription,
    onNavigate,
    onOpenUpgradeModal,
    onOpenUpgradePrompt,
    onOpenLogoutModal,
}) => {
    return (
        <Div variant="bg_white" vitri="col_none" className="h-full w-full flex flex-col" gap="g4_5" shape="none">
            {/* Sidebar profile header */}
            <Div className="border-b border-gray-200 pb-4" size="full" shape="none" gap="g3_4">
                <Div className="w-10 h-10 overflow-hidden bg-amber-800 shrink-0" shape="circle">
                    <img
                        src={user?.avatar}
                        alt="Avatar"
                        className="object-cover object-center w-full h-full"
                    />
                </Div>
                <Div vitri="col_none" className="min-w-0 flex-1 overflow-hidden" shape="none">
                    <H variant="text_black" line="truncate_1line" className="text-base font-semibold truncate" title={user?.name}>
                        {user?.name}
                    </H>
                    <P className="text-xs text-gray-500 truncate" line="truncate_1line" title={user?.email}>
                        {user?.email}
                    </P>
                </Div>
            </Div>

            <Div vitri="col_none" size="full" className="flex flex-col flex-1 overflow-hidden" shape="none">
                {/* 1. Luồng ưu tiên: System Admin */}
                {(user?.systemRole === "Admin" || user?.systemRole === "SYSTEM" || user?.systemRole?.name === "SYSTEM") ? (
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                        {SidebarMenuSystemAdmin.map((item) => (
                            <Div key={item.name} size="full">
                                <A
                                    variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                    sizea="p3_2"
                                    className="w-full justify-start gap-3"
                                    href={item.link}
                                    onClick={onNavigate}
                                >
                                    {item.icon}
                                    {item.name}
                                </A>
                            </Div>
                        ))}
                    </Div>
                ) : (!activeWorkspace || activeWorkspace.type === "CUSTOMER") ? (
                    /* 2. Luồng: Không gian Khách hàng */
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                        {SidebarMenuCustomer.map((item) => (
                            <Div key={item.name} size="full">
                                <A
                                    variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                    sizea="p3_2"
                                    className="w-full justify-start gap-3"
                                    href={item.link}
                                    onClick={onNavigate}
                                >
                                    {item.icon}
                                    {item.name}
                                </A>
                            </Div>
                        ))}

                        <Div size="full" className="mt-4 pt-4 border-t border-gray-200">
                            <Button
                                variant="gray_hover"
                                sizea="p3_2"
                                className="w-full justify-start gap-3 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                onClick={onOpenUpgradeModal}
                            >
                                <MdStore className="text-xl" />
                                Trở thành đối tác
                            </Button>
                        </Div>
                    </Div>
                ) : activeWorkspace.type === "BRAND" ? (
                    /* 3. Luồng: Không gian Chủ thương hiệu */
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                        {SidebarMenuBrandOwner.map((item) => (
                            <FeatureGate 
                                key={item.name} 
                                featureKey={item.featureKey} 
                                featuresData={(mySubscription as any)?.featuresData as Record<string, boolean>}
                                className="w-full"
                                onLockClick={onOpenUpgradePrompt}
                            >
                                <A
                                    variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                    sizea="p3_2"
                                    className="w-full justify-start gap-3"
                                    href={item.link}
                                    onClick={onNavigate}
                                >
                                    {item.icon}
                                    {item.name}
                                </A>
                            </FeatureGate>
                        ))}
                    </Div>
                ) : (
                    /* 4. Luồng: Không gian Chi nhánh Nhà hàng */
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4">
                        {SidebarMenuQuanLyNhaHang
                            .filter(item => {
                                const currentRole = activeWorkspace.role || user?.systemRole;
                                if (currentRole === "Quản lý nhà hàng" || currentRole === "Chủ thương hiệu" || currentRole === "Admin" || currentRole === "Quản lý thương hiệu") return true;
                                if (!item.permissions || item.permissions.length === 0) return true;
                                const userPerms = user?.permissions || [];
                                return item.permissions.some(p => userPerms.includes(p));
                            })
                            .map((item) => (
                                <FeatureGate 
                                    key={item.name} 
                                    featureKey={item.featureKey} 
                                    featuresData={(mySubscription as any)?.featuresData as Record<string, boolean>}
                                    className="w-full"
                                    onLockClick={onOpenUpgradePrompt}
                                >
                                    <A
                                        variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                        sizea="p3_2"
                                        className="w-full justify-start gap-3"
                                        href={item.link}
                                        onClick={onNavigate}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </A>
                                </FeatureGate>
                            ))}
                    </Div>
                )}

                {/* Nút Đăng xuất */}
                <Div vitri="col_none" size="full" shape="none" className="border-t border-gray-200 pt-4 mt-auto">
                    <Button
                        variant="gray_hover"
                        sizea="p3_2"
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                        onClick={onOpenLogoutModal}
                    >
                        <MdOutlineLogout className="text-lg" />
                        Đăng xuất
                    </Button>
                </Div>
            </Div>
        </Div>
    );
};

const PublicSidebar = () => {
    const router = useRouter();
    const { user, activeWorkspace, logout, isMobileSidebarOpen, setMobileSidebarOpen } = useAuthStore();
    const pathname = usePathname();
    
    // Tự động đóng mobile drawer khi chuyển trang
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [pathname, setMobileSidebarOpen]);

    const currentRole = activeWorkspace.role || user?.systemRole;
    const isBrandRole = currentRole === "Chủ thương hiệu" || currentRole === "Quản lý thương hiệu";
    const { data: mySubscription } = useGetMyBrandSubscription(isBrandRole);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isUpgradePromptOpen, setIsUpgradePromptOpen] = useState(false);

    const handleLogout = () => {
        setIsModalOpen(false);
        setMobileSidebarOpen(false);
        logout();
        router.push("/");
    };

    return (
        <>
            {/* 1. Desktop Sticky Sidebar (Chỉ hiện trên Desktop >= lg: 1024px) */}
            <aside className="hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 w-70 shrink-0 bg-white border-r border-gray-200 p-4 z-20">
                <SidebarContent
                    user={user}
                    activeWorkspace={activeWorkspace}
                    pathname={pathname}
                    mySubscription={mySubscription}
                    onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
                    onOpenUpgradePrompt={() => setIsUpgradePromptOpen(true)}
                    onOpenLogoutModal={() => setIsModalOpen(true)}
                />
            </aside>

            {/* 2. Mobile Off-Canvas Drawer (Chỉ hiện trên Mobile/Tablet < lg: 1024px) */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        {/* Backdrop làm mờ hậu cảnh */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                        />

                        {/* Drawer trượt từ bên phải */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 26, stiffness: 280 }}
                            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col p-4 z-10"
                        >
                            {/* Header của Drawer có nút đóng */}
                            <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Menu Quản trị
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                                    aria-label="Đóng menu"
                                    title="Đóng menu"
                                >
                                    <FiX className="w-5 h-5 text-xl" />
                                </button>
                            </div>

                            <SidebarContent
                                user={user}
                                activeWorkspace={activeWorkspace}
                                pathname={pathname}
                                mySubscription={mySubscription}
                                onNavigate={() => setMobileSidebarOpen(false)}
                                onOpenUpgradeModal={() => {
                                    setMobileSidebarOpen(false);
                                    setIsUpgradeModalOpen(true);
                                }}
                                onOpenUpgradePrompt={() => {
                                    setMobileSidebarOpen(false);
                                    setIsUpgradePromptOpen(true);
                                }}
                                onOpenLogoutModal={() => {
                                    setMobileSidebarOpen(false);
                                    setIsModalOpen(true);
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modals xác nhận & nâng cấp */}
            <ConfirmModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleLogout}
                title="Xác nhận đăng xuất"
                content="Bạn có chắc chắn muốn đăng xuất không?"
                confirmText="Đăng xuất"
                cancelText="Hủy"
            />

            <ConfirmModal
                open={isUpgradePromptOpen}
                onClose={() => setIsUpgradePromptOpen(false)}
                onConfirm={() => {
                    setIsUpgradePromptOpen(false);
                    router.push("/brand_owner/billing");
                }}
                title="Tính năng Cao cấp"
                content={activeWorkspace.type === 'RESTAURANT' 
                    ? "Tính năng này yêu cầu gói cước cao cấp. Vui lòng liên hệ Chủ thương hiệu để được hỗ trợ nâng cấp."
                    : "Vui lòng nâng cấp gói cước để được sử dụng tính năng này."}
                confirmText="Nâng cấp ngay"
                cancelText={activeWorkspace.type === 'RESTAURANT' ? "Đóng" : "Hủy"}
                hideConfirmButton={activeWorkspace.type === 'RESTAURANT'}
            />

            <UpgradeBrandAccountModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                userId={user?.id || ""}
            />
        </>
    );
};

export default PublicSidebar;
