"use client";

import React from 'react';
import FadeIn from "@/src/core/components/animation/FadeIn";
import { BsCalendar2Minus, BsBag } from "react-icons/bs";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { RiCoupon3Line } from "react-icons/ri";
import { CiStar } from "react-icons/ci";
import Link from "next/link";

export default function UserDashboardPage() {
    const quickLinks = [
        { name: "Đơn hàng của tôi", desc: "Quản lý các hóa đơn và món ăn đã đặt", icon: <BsBag className="text-2xl" />, link: "/user/orders", color: "text-blue-600 bg-blue-50 hover:bg-blue-100 ring-blue-200" },
        { name: "Lịch sử đặt bàn", desc: "Xem lại danh sách các bàn bạn đã đặt", icon: <BsCalendar2Minus className="text-2xl" />, link: "/user/reservations", color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-indigo-200" },
        { name: "Ví Voucher", desc: "Quản lý mã giảm giá và khuyến mãi", icon: <RiCoupon3Line className="text-2xl" />, link: "/user/promotions", color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 ring-emerald-200" },
        { name: "Đánh giá của tôi", desc: "Các nhà hàng bạn đã để lại đánh giá", icon: <CiStar className="text-2xl" />, link: "/user/reviews", color: "text-amber-600 bg-amber-50 hover:bg-amber-100 ring-amber-200" },
        { name: "Hóa đơn thanh toán", desc: "Lịch sử giao dịch và thanh toán", icon: <LiaFileInvoiceSolid className="text-2xl" />, link: "/user/invoices", color: "text-purple-600 bg-purple-50 hover:bg-purple-100 ring-purple-200" },
    ];

    return (
        <FadeIn className="w-full flex flex-col gap-8 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Xin chào, mừng bạn quay trở lại!</h1>
                <p className="text-slate-500 text-base">Đây là trang tổng quan quản lý các hoạt động cá nhân của bạn trên hệ thống.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-2">
                {quickLinks.map((item, index) => (
                    <Link key={index} href={item.link}>
                        <div className="flex flex-col items-start gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                            <div className={`p-4 rounded-2xl ring-1 ${item.color} transition-colors duration-300`}>
                                {item.icon}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-semibold text-slate-800">{item.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{item.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </FadeIn>
    );
}
