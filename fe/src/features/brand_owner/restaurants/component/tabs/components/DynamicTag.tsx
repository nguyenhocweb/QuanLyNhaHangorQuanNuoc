import React, { useState, useEffect } from "react";
import { useRandomColor } from "@/src/core/hooks/useRandomColor";

interface DynamicTagProps {
    text: string;
    icon: any;
    defaultBg?: string;
    defaultText?: string;
}

export const DynamicTag: React.FC<DynamicTagProps> = ({ text, icon: Icon, defaultBg, defaultText }) => {
    const { getRandomColorPair } = useRandomColor();
    const [colors, setColors] = useState({ bgColor: defaultBg || '#f3f4f6', textColor: defaultText || '#374151' });
    
    useEffect(() => {
        if (!defaultBg || !defaultText) {
            setColors(getRandomColorPair());
        } else {
            setColors({ bgColor: defaultBg, textColor: defaultText });
        }
    }, [getRandomColorPair, defaultBg, defaultText]);

    return (
        <span 
            className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm border border-black/5"
            style={{ backgroundColor: colors.bgColor, color: colors.textColor, borderColor: `${colors.textColor}30` }}
        >
            <Icon /> {text}
        </span>
    );
};
