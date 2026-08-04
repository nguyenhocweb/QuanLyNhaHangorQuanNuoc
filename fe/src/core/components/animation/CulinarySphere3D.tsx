"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";

interface CulinarySphere3DProps {
    color?: string;
    size?: number;
    speed?: number;
}

const WebGLSphereScene: React.FC<{ color?: string; size?: number; speed?: number }> = ({
    color = "#4338ca",
    size = 2.2,
    speed = 2.5
}) => {
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#4f46e5" />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#10b981" />

            <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
                <Sphere args={[1, 64, 64]} scale={size}>
                    <MeshDistortMaterial
                        color={color}
                        attach="material"
                        distort={0.4}
                        speed={speed}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Sphere>
            </Float>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
        </>
    );
};

export const CulinarySphere3D: React.FC<CulinarySphere3DProps> = ({
    color = "#4338ca",
    size = 2.2,
    speed = 2.5
}) => {
    const { is3D } = usePerformanceMode();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !is3D) {
        return (
            <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 opacity-80 blur-xl animate-pulse" />
                <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-white/40 shadow-[0_0_50px_rgba(79,70,229,0.3)] bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-md flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "15s" }} />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[360px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
            <Suspense fallback={
                <div className="w-64 h-64 rounded-full bg-indigo-500/20 animate-pulse flex items-center justify-center text-xs text-indigo-300">
                    Đang dựng 3D...
                </div>
            }>
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <WebGLSphereScene color={color} size={size} speed={speed} />
                </Canvas>
            </Suspense>
        </div>
    );
};
