"use client";

import React, { useRef, useState } from "react";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";

interface TiltCard3DProps {
    children: React.ReactNode;
    className?: string;
    depth?: number; // Độ nghiêng tối đa (mặc định 15 độ)
    glareOpacity?: number; // Độ sáng của hào quang phản chiếu (0 -> 1)
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
    children,
    className = "",
    depth = 12,
    glareOpacity = 0.25
}) => {
    const { is3D } = usePerformanceMode();
    const cardRef = useRef<HTMLDivElement>(null);

    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!is3D || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Tính góc xoay từ tâm thẻ (-depth đến +depth)
        const rX = ((mouseY / height) - 0.5) * -depth * 2;
        const rY = ((mouseX / width) - 0.5) * depth * 2;

        setRotateX(rX);
        setRotateY(rY);

        // Vị trí ánh sáng phản chiếu (Tính theo %)
        setGlarePosition({
            x: (mouseX / width) * 100,
            y: (mouseY / height) * 100
        });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
    };

    // Chuẩn bị style hiển thị theo chế độ
    const cardStyle: React.CSSProperties = is3D
        ? {
              transform: isHovered
                  ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
                  : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              transformStyle: "preserve-3d",
              willChange: "transform"
          }
        : {};

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={cardStyle}
            className={`relative rounded-2xl overflow-hidden ${
                !is3D
                    ? "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-200/80"
                    : "shadow-lg hover:shadow-2xl"
            } ${className}`}
        >
            {/* Nội dung chính của Thẻ */}
            <div className="w-full h-full relative z-10">{children}</div>

            {/* Lớp ánh sáng hào quang (Specular Glare Overlay) chỉ bật khi ở chế độ 3D và đang hover */}
            {is3D && isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 mix-blend-overlay"
                    style={{
                        background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glareOpacity}), transparent 70%)`,
                        opacity: isHovered ? 1 : 0
                    }}
                />
            )}
        </div>
    );
};
