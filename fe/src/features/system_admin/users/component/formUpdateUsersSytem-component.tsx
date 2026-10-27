"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  FiX, 
  FiEdit3, 
  FiLoader, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiShield, 
  FiCheck,
  FiInfo 
} from "react-icons/fi";
import { updateUserSchema, UpdateUserFormValues } from '../schema/usersSytem-schema';
import { useUpdateUserSystem } from '../hook/useUpdateUserSystem';
import { User } from '../type/usersSytem-type';

interface FormUpdateUsersSystemProps {
  user: User;
  onClose: () => void;
}

export const FormUpdateUsersSystemComponent: React.FC<FormUpdateUsersSystemProps> = ({ user, onClose }) => {
  const { mutate: updateUser, isPending } = useUpdateUserSystem();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema) as any,
    defaultValues: {
      name: user.name,
      phone: user.phone || '',
      status: user.status as any,
    }
  });

  useEffect(() => {
    reset({
      name: user.name,
      phone: user.phone || '',
      status: user.status as any,
    });
  }, [user, reset]);

  const onSubmit = (data: UpdateUserFormValues) => {
    updateUser({ id: user.id, payload: data }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const roleName = typeof user.role === 'object' && user.role !== null ? (user.role as any).name : user.role;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-blue-50/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-200/50 shrink-0">
              <FiEdit3 className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Cập nhật thông tin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Chỉnh sửa thông tin tài khoản của <span className="font-semibold text-slate-700">{user.name}</span>
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
            
            {/* Read-only account credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Email / Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-600">
                  Email / Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input 
                    disabled
                    value={user.email || (user as any).user_name || "---"} 
                    className="w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-100/80 border border-slate-200/70 text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Vai trò */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-600">
                  Vai trò hiện tại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FiShield className="w-4 h-4" />
                  </div>
                  <input 
                    disabled
                    value={roleName || "Khách hàng"} 
                    className="w-full text-sm pl-10 pr-3.5 h-11 rounded-xl bg-slate-100/80 border border-slate-200/70 text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Editable Fields */}
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
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <span className="text-red-500 text-xs font-medium pl-1">
                    {errors.name.message}
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
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
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

            {/* Trạng thái */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Trạng thái tài khoản
              </label>
              <div className="relative">
                <select 
                  {...register('status')}
                  className="w-full appearance-none text-sm pl-3.5 pr-8 h-11 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
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

            {/* Info alert */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-800">
              <FiInfo className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Mật khẩu và thông tin đăng nhập chính được bảo vệ. Nếu người dùng quên mật khẩu, vui lòng sử dụng chức năng Đặt lại mật khẩu.
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md shadow-blue-200/50 hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold text-sm disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isPending ? (
                <>
                  <FiLoader className="animate-spin text-base" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-base" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
