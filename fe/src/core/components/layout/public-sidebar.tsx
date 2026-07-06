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
import { FiUsers, FiMap } from "react-icons/fi";
import { BsShop, BsClipboardData, BsReceipt, BsCalendar2Check } from "react-icons/bs";
import { BiBuildingHouse, BiSupport } from "react-icons/bi";
import { RiAdminLine, RiBillLine } from "react-icons/ri";
// 1. TÁC NHÂN: SYSTEM ADMIN (Quản trị viên hệ thống Foleat)
// Mục tiêu: Giám sát tenant (Brand), user global và master data. Không can thiệp kinh doanh.
export const SidebarMenuSystemAdmin = [
    { name: "Tổng quan", link: "/system/dashboard", icon: <MdOutlineDashboard className="text-xl" /> },
    { name: "Hồ sơ cá nhân", link: "/system/profile", icon: <BsPersonFill className="text-xl" /> },
    { name: "Quản lý Thương hiệu", link: "/system/brands", icon: <BiBuildingHouse className="text-xl" /> },
    { name: "Quản lý Gói cước", link: "/system/subscriptions", icon: <MdCardMembership className="text-xl" /> },
    { name: "Tài khoản toàn cục", link: "/system/users", icon: <FiUsers className="text-xl" /> },
    { name: "Danh mục chuẩn", link: "/system/categories", icon: <MdCategory className="text-xl" /> }, // Thể loại nhà hàng (Lẩu, Nướng...)
    { name: "Quản lý Nhà hàng", link: "/system/restaurants", icon: <MdStore className="text-xl" /> },
    { name: "Gói dịch vụ & Thanh toán", link: "/system/billing", icon: <RiBillLine className="text-xl" /> },
    { name: "Phương thức thanh toán", link: "/system/payment-methods", icon: <MdPayment className="text-xl" /> },
    { name: "Cài đặt hệ thống", link: "/system/settings", icon: <MdOutlineSettings className="text-xl" /> },
];
const SidebarMenuCustomer = [
    { name: "Hồ sơ cá nhân", link: "/user/profile", icon: <BsPersonFill className="text-xl" /> },
    { name: "Thông báo", link: "/user/notifications", icon: <IoIosNotificationsOutline className="text-xl" /> },
    { name: "Lịch sử đặt bàn", link: "/user/reservations", icon: <BsCalendar2Minus className="text-lg" /> },
    { name: "Đơn hàng của tôi", link: "/user/orders", icon: <BsBag className="text-lg" /> },
    { name: "Hóa đơn", link: "/user/invoices", icon: <LiaFileInvoiceSolid className="text-xl" /> },
    { name: "Đánh giá", link: "/user/reviews", icon: <CiStar className="text-lg" /> },

];

import { useAuthStore } from "@/src/features/auth/auth_store/use-auth-store";
import { A, Button, Div, H, P } from "../ui";
import { usePathname } from "next/navigation";
import { ConfirmModal } from "./public-ConfirmModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
const PublicSidebar = () => {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleLogout = () => {

        setIsModalOpen(false);
        logout();
        router.push("/");
    }
    
    return (
        <Div variant="bg_white" vitri="col_none" className="h-[90vh] sticky top-16 w-70" gap="g4_5" shape="none">
            {/* sidebar mô tả profile */}
            <Div className="border-b border-gray-300 pb-4" size="full" shape="none" gap="g3_4"  >
                <Div className="w-10 h-10 overflow-hidden bg-amber-800" shape="circle" >
                    <img
                        src={user?.avatar}
                        alt="Avatar"
                        className=" object-cover object-center w-full h-full"
                    />
                </Div>
                <Div vitri="col_none" className="w-2/3" shape="none" >
                    <H variant="text_black" line="truncate_1line" className="text-lg font-semibold" title={user?.name}>
                        {user?.name}
                    </H>
                    <P className="text-sm" line="truncate_1line" title={user?.email}>
                        {user?.email}
                    </P>
                </Div>
            </Div>
            <Div
                vitri="col_none"
                size="full"
                className=" justify-between h-full overflow-hidden"
                shape="none" >

                {/* dành cho khách hàng */}
                {user?.role === "Khách hàng" && (
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4"
                        className=" h-9/10 overflow-y-auto overflow-x-hidden "
                    >
                        {SidebarMenuCustomer.map((item) => (
                            <Div key={item.name} size="full">
                                <A
                                    variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                    sizea="p3_2"
                                    className={`w-full justify-start gap-3`}

                                    href={item.link}
                                >
                                    {item.icon}
                                    {item.name}
                                </A>
                            </Div>
                        ))}
                    </Div>

                )}
                {/* dành cho admin  */}
                {(user?.role === "Admin" || user?.role === "SYSTEM" || user?.role?.name === "SYSTEM") && (
                    <Div vitri="col_none" size="full" shape="none" gap="g3_4"
                        className=" h-9/10 overflow-y-auto overflow-x-hidden "
                    >
                        {SidebarMenuSystemAdmin.map((item) => (
                            <Div key={item.name} size="full">
                                <A
                                    variant={pathname.startsWith(item.link) ? "green" : "gray_hover"}
                                    sizea="p3_2"
                                    className={`w-full justify-start gap-3`}

                                    href={item.link}
                                >
                                    {item.icon}
                                    {item.name}
                                </A>
                            </Div>
                        ))}
                    </Div>
                )}
                <Div vitri="col_none" size="full" shape="none" className=" border-t border-gray-300 pt-4 ">
                    <Button
                        variant="gray_hover"
                        sizea="p3_2"
                        className='w-full justify-start gap-3 text-red-600'
                        onClick={()=>{setIsModalOpen(prev=>!prev)}}

                    >
                        <MdOutlineLogout className="text-lg" />
                        Đăng xuất
                    </Button>
                </Div>
            </Div>
            <ConfirmModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    
                    handleLogout();
                }}
                title="Xác nhận đăng xuất"
                content="Bạn có chắc chắn muốn đăng xuất không?"
                confirmText="Đăng xuất"
                cancelText="Hủy"
            />
        </Div>
    )
}

export default PublicSidebar