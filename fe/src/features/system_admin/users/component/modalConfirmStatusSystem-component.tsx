import React from 'react';
import { FiUnlock, FiLock, FiLoader, FiX, FiAlertTriangle } from "react-icons/fi";
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
            isLocked 
              ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50' 
              : 'bg-rose-50 text-rose-600 shadow-rose-100/50'
          }`}>
            {isLocked ? <FiUnlock className="text-2xl" /> : <FiLock className="text-2xl" />}
          </div>
          
          <div className="flex flex-col gap-1 mt-1">
            <h3 className="text-xl font-bold text-slate-900">
              {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              {isLocked 
                ? 'Tài khoản này sẽ được khôi phục quyền đăng nhập và sử dụng mọi tính năng.'
                : 'Người dùng sẽ bị thu hồi quyền đăng nhập và tạm khóa toàn bộ phiên làm việc.'}
            </p>
          </div>

          {/* User Preview Chip */}
          <div className="w-full mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-slate-900 text-sm truncate">{user.name}</span>
              <span className="text-xs text-slate-500 truncate">{user.email}</span>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
              isLocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isLocked ? 'Đang khóa' : 'Hoạt động'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 w-full">
          <button 
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm transition-colors cursor-pointer"
          >
            Hủy thao tác
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              isLocked 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
            }`}
          >
            {isPending ? (
              <>
                <FiLoader className="animate-spin text-base" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                {isLocked ? <FiUnlock className="text-base" /> : <FiLock className="text-base" />}
                <span>{isLocked ? 'Xác nhận mở khóa' : 'Xác nhận khóa'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

