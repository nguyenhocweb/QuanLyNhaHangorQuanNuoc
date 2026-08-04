"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";

interface FloatingItemProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    offsetY?: number;
    rotateRange?: number;
    depthZ?: number; // Độ sâu Z trong không gian 3D (-100px đến 100px)
}

export const ParallaxFloating3D: React.FC<FloatingItemProps> = ({
    children,
    className = "",
    delay = 0,
    duration = 4,
    offsetY = 15,
    rotateRange = 5,
    depthZ = 20
}) => {
    const { is3D } = usePerformanceMode();

    if (!is3D) {
        // Chế độ 2D Senior Pro Max: Hiển thị mượt mà không có chuyển động bay lơ lửng liên tục
        return (
            <div className={`transition-all duration-300 hover:scale-105 ${className}`}>
                {children}
            </div>
        );
    }

    // Chế độ 3D: Bay lơ lửng trong không gian 3D với độ lệch Z (Parallax Depth)
    return (
        <motion.div
            className={`transform-gpu ${className}`}
            style={{
                transformStyle: "preserve-3d",
                translateZ: `${depthZ}px`
            }}
            animate={{
                y: [0, -offsetY, 0],
                rotateZ: [0, rotateRange, -rotateRange, 0],
                rotateY: [0, rotateRange / 2, -rotateRange / 2, 0]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
        >
            {children}
        </motion.div>
    );
};
