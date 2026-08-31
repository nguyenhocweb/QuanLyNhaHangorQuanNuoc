import React, { useState } from 'react';
import { MdClose, MdCheck } from 'react-icons/md';
import { MenuItemData } from '../type/dine_in_order.type';

interface Props {
    item: MenuItemData | null;
    initialNote?: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: MenuItemData, note: string) => void;
}

const QUICK_NOTES = [
    'Ít đá',
    'Ít đường',
    'Không cay',
    'Không hành',
    'Không rau mùi',
    'Lên món sau cùng',
    'Lên món trước',
    'Mang thêm đá',
];

export const DishNoteModal: React.FC<Props> = ({
    item,
    initialNote = '',
    isOpen,
    onClose,
    onSave
}) => {
    const [note, setNote] = useState(initialNote);

    React.useEffect(() => {
        setNote(initialNote || '');
    }, [initialNote, isOpen]);

    if (!isOpen || !item) return null;

    const handleAddQuickNote = (tag: string) => {
        if (note.includes(tag)) return;
        setNote(prev => prev ? `${prev}, ${tag}` : tag);
    };

    const handleSave = () => {
        onSave(item, note.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-4 border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                        <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                            {item.price?.toLocaleString('vi-VN')}đ
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>

                {/* Quick Note Tags */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-2">Gợi ý ghi chú nhanh:</label>
                    <div className="flex flex-wrap gap-1.5">
                        {QUICK_NOTES.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => handleAddQuickNote(tag)}
                                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                    note.includes(tag)
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Note Textarea */}
                <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Ghi chú đặc biệt cho món ăn:</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ví dụ: Ăn chín kỹ, nhiều sốt,..."
                        rows={3}
                        className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                        <MdCheck className="text-base" /> Lưu ghi chú
                    </button>
                </div>
            </div>
        </div>
    );
};
