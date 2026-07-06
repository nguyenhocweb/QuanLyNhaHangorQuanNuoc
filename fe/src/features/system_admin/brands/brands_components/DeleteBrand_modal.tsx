import { useState } from "react";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import { Brand } from "../brands_type/brand-type";
import { useDeleteBrand } from "../brands_hook/useDeleteBrand_hook";

interface Props {
    brand: Brand;
    onClose: () => void;
}

const DeleteBrand_modal = ({ brand, onClose }: Props) => {
    const { mutate: deleteBrand, isPending } = useDeleteBrand();
    const [confirmText, setConfirmText] = useState("");

    const isMatch = confirmText === brand.name;

    const handleDelete = () => {
        if (!isMatch) return;
        deleteBrand(brand.id, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    disabled={isPending}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10"
                >
                    <IoClose />
                </button>

                <div className="p-6 md:p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-red-50">
                        <IoWarningOutline />
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Chấm dứt thương hiệu</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Bạn đang chuẩn bị chấm dứt hoạt động của thương hiệu <strong className="text-red-500">{brand.name}</strong>. Hành động này sẽ chuyển trạng thái của thương hiệu thành <strong>Đã chấm dứt</strong>.
                    </p>

                    <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 text-left">
                        <label className="block text-xs font-semibold text-slate-700 mb-2">
                            Để xác nhận, vui lòng nhập chính xác tên thương hiệu: <br/>
                            <span className="text-red-500 italic select-none">{brand.name}</span>
                        </label>
                        <input 
                            type="text" 
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Nhập tên thương hiệu..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                    </div>

                    <div className="w-full flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="button"
                            onClick={handleDelete}
                            disabled={!isMatch || isPending}
                            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isPending ? 'Đang xử lý...' : 'Xác nhận chấm dứt'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteBrand_modal;
