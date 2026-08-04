"use client";
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { H, P, Button, Input, Select, Label } from "@/src/core/components/ui";
import { FiX, FiSave, FiEdit3, FiLoader } from "react-icons/fi";
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
    resolver: zodResolver(updateUserSchema),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner shadow-blue-100">
              <FiEdit3 className="text-2xl" />
            </div>
            <div className="flex flex-col">
              <H variant="text_black" className="text-xl font-bold text-gray-900 tracking-tight">Cập nhật người dùng</H>
              <P className="text-sm text-gray-500 mt-0.5">Sửa thông tin của {user.name}</P>
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
                Tên đăng nhập / Email
              </Label>
              <Input 
                disabled
                value={`${user.email}`} 
                className="w-full text-[15px] px-4 h-[48px] rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
              />
              <P className="text-[12px] text-gray-400 ml-1 mt-1">Thông tin đăng nhập không thể thay đổi</P>
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Tên người dùng (Họ và tên) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                {...register('name')}
                placeholder="Ví dụ: Nguyễn Văn A" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white text-black ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
              />
              {errors.name && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Số điện thoại
              </Label>
              <Input 
                type="tel"
                {...register('phone')}
                placeholder="09xx xxx xxx" 
                className={`w-full text-[15px] px-4 h-[48px] rounded-xl focus:ring-2 transition-all bg-gray-50/50 hover:bg-white text-black ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
              />
              {errors.phone && <span className="text-red-500 text-[12px] absolute -bottom-5 left-1 font-medium">{errors.phone.message}</span>}
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Vai trò hiện tại
              </Label>
              <Input 
                disabled
                value={typeof user.role === 'object' ? (user.role as any).name : user.role} 
                className="w-full text-[15px] px-4 h-[48px] rounded-xl bg-gray-100 border-transparent text-gray-500 cursor-not-allowed"
              />
              <P className="text-[12px] text-gray-400 ml-1 mt-1">Vai trò không được đổi tại đây</P>
            </div>

            <div className="flex flex-col gap-2 relative">
              <Label className="text-[14px] font-semibold text-gray-700 ml-1">
                Trạng thái
              </Label>
              <Select 
                {...register('status')}
                className="w-full text-[15px] px-4 border-gray-200 h-[48px] rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/50 hover:bg-white text-black"
              >
                <option value="ACTIVE" className="text-black">Hoạt động (ACTIVE)</option>
                <option value="PENDING" className="text-black">Chờ xác minh (PENDING)</option>
                <option value="BANNED" className="text-black">Đã khóa (BANNED)</option>
              </Select>
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg shadow-blue-200 transition-all font-semibold text-[14px] transform hover:translate-y-[-1px] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isPending ? <FiLoader className="animate-spin text-lg" /> : <FiSave className="text-lg" />} 
              {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
