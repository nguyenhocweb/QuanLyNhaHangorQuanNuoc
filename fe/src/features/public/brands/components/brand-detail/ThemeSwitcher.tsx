import React from "react";
import { BrandTemplateTheme, BRAND_TEMPLATES } from "@/src/core/lib/configTemplates";
import { FaPaintBrush, FaTimes } from "react-icons/fa";

interface ThemeSwitcherProps {
    currentTheme: BrandTemplateTheme;
    onChangeTheme: (theme: BrandTemplateTheme) => void;
}

const ThemeSwitcher = ({ currentTheme, onChangeTheme }: ThemeSwitcherProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const themes = BRAND_TEMPLATES;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700 animate-fade-in-up w-64">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2">
                        Xem trước Mẫu (Preview)
                    </h3>
                    <div className="space-y-2">
                        {themes.map((theme) => (
                            <button
                                key={theme.code}
                                onClick={() => {
                                    onChangeTheme(theme.code);
                                    // setIsOpen(false); // keep open for easy switching
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                                    currentTheme === theme.code
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold ring-1 ring-indigo-500"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${theme.color}`}></span>
                                    {theme.name}
                                </span>
                                {currentTheme === theme.code && <span className="text-xs">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                title="Thay đổi Mẫu giao diện"
            >
                {isOpen ? <FaTimes /> : <FaPaintBrush />}
            </button>
        </div>
    );
};

export default ThemeSwitcher;
