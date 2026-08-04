import FadeIn from "@/src/core/components/animation/FadeIn";
import React from 'react';
import { H, P, Button } from "@/src/core/components/ui";
import { FiAlertTriangle, FiUnlock, FiLock, FiLoader } from "react-icons/fi";
import { User } from '../type/usersSytem-type';
import { useUpdateUserSystem } from '../hook/useUpdateUserSystem';

interface ModalConfirmStatusProps {
  user: User;
  onClose: () => void;
}

export const ModalConfirmStatusSystemComponent: React.FC<ModalConfirmStatusProps> = ({ user, onClose }) => {
  const { mutate: updateUser, isPending } = useUpdateUserSystem();
  
  const isLocked = user.status === 'BANNED';
  const newStatus = isLocked ? 'ACTIVE' : 'BANNED';
  
  const handleConfirm = () => {
    updateUser({ id: user.id, payload: { status: newStatus } }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 p-6">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isLocked ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
            {isLocked ? <FiUnlock className="text-3xl" /> : <FiLock className="text-3xl" />}
          </div>
          
          <div className="flex flex-col gap-2">
            <H variant="text_black" className="text-xl font-bold text-gray-900">
              {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </H>
            <p className="text-[14px] text-gray-500">
              Bạn có chắc chắn muốn {isLocked ? 'mở khóa' : 'khóa'} tài khoản <strong>{user.name}</strong> không?
              {!isLocked && " Người này sẽ không thể đăng nhập vào hệ thống."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 w-full">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl border-gray-200 text-gray-600 bg-white hover:bg-gray-50 font-semibold"
          >
            Hủy
          </Button>
          <Button 
            variant="default" 
            onClick={handleConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${isLocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {isPending && <FiLoader className="animate-spin" />}
            {isPending ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </div>

      </div>
    </div>
  );
};
