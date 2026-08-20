"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { H, P, Button, Input, Select, Label } from "@/src/core/components/ui";
import { FiX, FiSave, FiUserPlus, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
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
    resolver: zodResolver(createUserSchema),
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
        onClose(); // Đóng modal nếu thành công
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shadow-indigo-100">
              <FiUserPlus className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <H variant="text_black" className="text-xl font-bold text-gray-900 tracking-tight">Thêm người dùng mới</H>
              <P className="text-sm text-gray-500 mt-0.5">Tạo tài khoản quản trị viên hoặc người dùng</P>
            </div>
          </div>
          <button onClick={onClose} disabled={isPending} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Tên người dùng (Họ và tên) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                {...register('name')}
                placeholder="Ví dụ: Nguyễn Văn A" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              />
              {errors.name && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Tên đăng nhập <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                {...register('user_name')}
                placeholder="Ví dụ: nguyenvana" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.user_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              />
              {errors.user_name && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.user_name.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Email <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                type="email"
                {...register('email')}
                placeholder="Email liên hệ" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              />
              {errors.email && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Số điện thoại
              </Label>
              <Input 
                type="tel"
                {...register('phone')}
                placeholder="09xx xxx xxx" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
              />
              {errors.phone && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Mật khẩu <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  placeholder="Mật khẩu ít nhất 6 ký tự" 
                  className={`w-full text-[15px] px-4 pr-10 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.password.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Nhập lại mật khẩu <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword')}
                  placeholder="Nhập lại mật khẩu vừa tạo" 
                  className={`w-full text-[15px] px-4 pr-10 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.confirmPassword.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Trạng thái
              </Label>
              <Select 
                {...register('status')}
                className="w-full text-[15px] px-4 border-gray-200 h-[48px] rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50/50 hover:bg-white text-black"
              >
                <option value="ACTIVE" className="text-black">Hoạt động (ACTIVE)</option>
                <option value="PENDING" className="text-black">Chờ xác minh (PENDING)</option>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Vai trò <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                disabled
                value="Khách hàng / Đối tác (Cơ bản)"
                className="w-full text-[15px] px-4 h-[48px] rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
              />
              <P className="text-[13px] text-gray-400 mt-2 ml-1">Tài khoản tạo mới mặc định có quyền Khách hàng. Quyền Quản lý sẽ được cấp khi gán vào một Thương hiệu.</P>
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl mt-auto">
            <Button 
              type="button" 
              onClick={onClose} 
              disabled={isPending}
              variant="outline" 
              className="px-6 py-2.5 rounded-xl border-gray-200 text-gray-600 bg-white hover:bg-gray-100 hover:text-gray-900 transition-all font-semibold text-[14px]"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              variant="default" 
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all font-semibold text-[14px] transform hover:translate-y-[-1px] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending ? <FiLoader className="animate-spin text-lg" /> : <FiSave className="text-lg" />} 
              {isPending ? 'Đang lưu...' : 'Lưu tài khoản'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
