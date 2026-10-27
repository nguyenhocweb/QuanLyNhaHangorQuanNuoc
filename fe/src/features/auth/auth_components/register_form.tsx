"use client";

import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const FormRegister = () => {
    const [newPass, setNewPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    return (
        <form className="w-full flex flex-col gap-y-4">
            {/* Tên đăng nhập */}
            <div>
                <label htmlFor="user_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="user_name"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                    <CiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Họ và tên */}
            <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="name"
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                    <CiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xl text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                    <TfiEmail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Ngày sinh & Giới tính */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label htmlFor="Birthday" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Ngày sinh
                    </label>
                    <input
                        id="Birthday"
                        type="date"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Giới tính
                    </label>
                    <select
                        id="gender"
                        defaultValue=""
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all cursor-pointer"
                    >
                        <option value="" disabled>-- Chọn giới tính --</option>
                        <option value="NAM">Nam</option>
                        <option value="NU">Nữ</option>
                        <option value="KHAC">Khác</option>
                    </select>
                </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={newPass ? "text" : "password"}
                        id="password"
                        placeholder="Tối thiểu 8 ký tự"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setNewPass((e) => !e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none"
                    >
                        {newPass ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                    </button>
                </div>
            </div>

            {/* Nhập lại Mật khẩu */}
            <div>
                <label htmlFor="confirm_password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nhập lại Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type={confirmPassword ? "text" : "password"}
                        id="confirm_password"
                        placeholder="Nhập lại mật khẩu vừa nhập"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setConfirmPassword((e) => !e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer focus:outline-none"
                    >
                        {confirmPassword ? <FaRegEye className="text-lg" /> : <FaRegEyeSlash className="text-lg" />}
                    </button>
                </div>
            </div>

            {/* Nút đăng ký */}
            <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
                Đăng ký tài khoản
            </button>
        </form>
    );
};

export default FormRegister;