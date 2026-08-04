"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoImageCarouselProps {
    images: string[];
    interval?: number;
    className?: string;
    alt?: string;
}

const AutoImageCarousel: React.FC<AutoImageCarouselProps> = ({ 
    images, 
    interval = 5000, 
    className = "", 
    alt = "Carousel Image" 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 ${className}`}></div>
        );
    }

    if (images.length === 1) {
        return (
            <img 
                src={images[0]} 
                alt={alt} 
                className={`w-full h-full object-cover ${className}`} 
            />
        );
    }

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <AnimatePresence>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${alt} ${currentIndex + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
            </AnimatePresence>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                            currentIndex === idx 
                                ? 'w-8 bg-white opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                                : 'w-2 bg-white/50 opacity-60 hover:opacity-100 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
            
            {/* Gradient Overlay for better contrast with indicators */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

export default AutoImageCarousel;
