import { useCallback } from 'react';

export const useRandomColor = () => {
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    };

    const getLighterColor = useCallback((hex: string, factor = 0.85) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return "#EEF2FF";
        const r = Math.round(rgb.r + (255 - rgb.r) * factor);
        const g = Math.round(rgb.g + (255 - rgb.g) * factor);
        const b = Math.round(rgb.b + (255 - rgb.b) * factor);
        return rgbToHex(r, g, b);
    }, []);

    const getDarkerColor = useCallback((hex: string, factor = 0.6) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return "#6366F1";
        const r = Math.round(rgb.r * (1 - factor));
        const g = Math.round(rgb.g * (1 - factor));
        const b = Math.round(rgb.b * (1 - factor));
        return rgbToHex(r, g, b);
    }, []);

    const getRandomColorPair = useCallback(() => {
        // Generate random vibrant/dark color for text to ensure readability
        const r = Math.floor(Math.random() * 200); 
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        
        const textColor = rgbToHex(r, g, b);
        const bgColor = getLighterColor(textColor);
        
        return { textColor, bgColor };
    }, [getLighterColor]);

    return { getLighterColor, getDarkerColor, getRandomColorPair };
};
