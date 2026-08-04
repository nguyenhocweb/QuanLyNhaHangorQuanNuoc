"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AutoItemCarouselProps {
    items: React.ReactNode[];
    interval?: number; // Tốc độ chạy (giây/vòng)
    className?: string;
    width?: string | number;
    height?: string | number;
}

const AutoItemCarousel: React.FC<AutoItemCarouselProps> = ({ 
    items, 
    interval = 15, // Thời gian (giây) cho 1 vòng lặp
    className = "",
    width = "100%",
    height = "100%"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const checkWidth = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const contentWidth = contentRef.current.offsetWidth;
                // Chỉ animate khi nội dung thực sự dài hơn container
                setShouldAnimate(contentWidth > containerWidth);
            }
        };

        checkWidth();
        
        const observer = new ResizeObserver(checkWidth);
        if (containerRef.current) observer.observe(containerRef.current);
        if (contentRef.current) observer.observe(contentRef.current);

        return () => {
            observer.disconnect();
        };
    }, [items]);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} style={{ width, height }} className={`relative overflow-hidden flex items-center ${className}`}>
            {/* Vệt mờ hai bên để hiệu ứng mượt hơn khi item đi vào/đi ra (chỉ hiển thị khi đang chạy) */}
            {shouldAnimate && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                </>
            )}

            <motion.div
                className="flex min-w-max"
                animate={shouldAnimate ? { x: ["0%", "-50%"] } : { x: "0%" }} // Chạy từ 0 đến nửa chiều dài (vì dùng 2 block)
                transition={shouldAnimate ? { 
                    duration: interval,
                    ease: "linear",
                    repeat: Infinity 
                } : {}}
            >
                {/* Block gốc để đo kích thước */}
                <div ref={contentRef} className="flex gap-2 items-center pr-2">
                    {items.map((item, index) => (
                        <div key={`orig-${index}`} className="flex-shrink-0">
                            {item}
                        </div>
                    ))}
                </div>

                {/* Block nhân bản (chỉ xuất hiện khi cần animate) */}
                {shouldAnimate && (
                    <div className="flex gap-2 items-center pr-2">
                        {items.map((item, index) => (
                            <div key={`dup-${index}`} className="flex-shrink-0">
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AutoItemCarousel;
