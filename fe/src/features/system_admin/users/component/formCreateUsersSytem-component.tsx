"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  FiX, 
  FiUserPlus, 
  FiLoader, 
  FiEye, 
  FiEyeOff, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiAtSign, 
  FiShield, 
  FiCheck,
  FiInfo
} from "react-icons/fi";
import { createUserSchema, CreateUserFormValues } from '../schema/usersSytem-schema';
import { useCreateUserSystem } from '../hook/useCreateUserSystem';

interface FormCreateUsersSystemProps {
  onClose: () => void;
}

export const FormCreateUsersSystemComponent: React.FC<FormCreateUsersSystemProps> = ({ onClose }) => {
  const { mutate: createUser, isPending } = useCreateUserSystem();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema) as any,
    defaultValues: {
      name: '',
      user_name: '',
      email: '',
      phone: '',
      password: '',
      systemRoleId: 'Khách hàng',
      status: 'ACTIVE',
      confirmPassword: ''
    }
  });

  const onSubmit = (data: CreateUserFormValues) => {
    createUser(data, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200/50 shrink-0">
              <FiUserPlus className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Thêm người dùng mới
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Khởi tạo tài khoản người dùng hoặc quản trị viên trên hệ thống
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isPending} 
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
            title="Đóng modal"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="p-6 sm:p-8 flex flex-col gap-5 max-h-[72vh] overflow-y-auto custom-scrollbar">
            
            {/* Grid 2 cột: Họ tên & Tên đăng nhập */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Họ và tên */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Họ và tên</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input 
                    {...register('name')}
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A" 
                    className={`w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.name 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Tên đăng nhập */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Tên đăng nhập</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiAtSign className="w-4 h-4" />
                  </div>
                  <input 
                    {...register('user_name')}
                    type="text"
                    placeholder="Ví dụ: nguyenvana" 
                    className={`w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.user_name 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.user_name && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.user_name.message}
                  </span>
                )}
              </div>
            </div>

            {/* Grid 2 cột: Email & Số điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Email</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email"
                    {...register('email')}
                    placeholder="name@company.com" 
                    className={`w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.email 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between">
                  <span>Số điện thoại</span>
                  <span className="text-[11px] text-slate-400 font-normal">Không bắt buộc</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel"
                    {...register('phone')}
                    placeholder="09xx xxx xxx" 
                    className={`w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.phone 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            {/* Grid 2 cột: Mật khẩu & Nhập lại mật khẩu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Mật khẩu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Mật khẩu</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    placeholder="Tối thiểu 6 ký tự" 
                    className={`w-full text-sm pl-10 pr-10 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.password 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md cursor-pointer"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Nhập lại mật khẩu</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiShield className="w-4 h-4" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    placeholder="Khớp với mật khẩu trên" 
                    className={`w-full text-sm pl-10 pr-10 h-11 rounded-xl bg-slate-50/70 border transition-all text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md cursor-pointer"
                    title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Grid 2 cột: Trạng thái & Vai trò */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
              {/* Trạng thái */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Trạng thái kích hoạt
                </label>
                <div className="relative">
                  <select 
                    {...register('status')}
                    className="w-full appearance-none text-sm pl-3.5 pr-8 h-11 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="ACTIVE">🟢 Đang hoạt động (ACTIVE)</option>
                    <option value="PENDING">🟡 Chờ xác minh (PENDING)</option>
                    <option value="BANNED">🔴 Đã khóa (BANNED)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Vai trò */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <span>Vai trò mặc định</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="h-11 px-3.5 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-between text-slate-600 text-sm">
                  <span className="font-semibold text-slate-700">Khách hàng / Đối tác</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-semibold">
                    Cơ bản
                  </span>
                </div>
              </div>
            </div>

            {/* Note alert */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-800">
              <FiInfo className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                Tài khoản mới tạo sẽ có quyền truy cập cơ bản. Quyền quản trị thương hiệu hoặc nhà hàng sẽ tự động kích hoạt khi tài khoản được phân quyền trong phần Thương hiệu.
              </span>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 rounded-b-3xl mt-auto">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold text-sm cursor-pointer shadow-xs disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 shadow-md shadow-indigo-200/50 hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold text-sm disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isPending ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  <span>Đang khởi tạo...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-base" />
                  <span>Tạo tài khoản</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
