"use client";

import React, { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePerformanceMode } from "../../hooks/usePerformanceMode";

// Bảng màu sang trọng, đa sắc rực rỡ (Multicolor Palette)
const PALETTE_2D = [
    { base: "rgba(99, 102, 241, ", name: "Indigo" },
    { base: "rgba(16, 185, 129, ", name: "Emerald" },
    { base: "rgba(245, 158, 11, ", name: "Amber" },
    { base: "rgba(236, 72, 153, ", name: "Rose" },
    { base: "rgba(6, 182, 212, ",  name: "Cyan" },
    { base: "rgba(139, 92, 246, ", name: "Purple" },
];

const PALETTE_3D = [
    "#6366f1", // Indigo
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ec4899", // Rose
    "#06b6d4", // Cyan
    "#8b5cf6", // Purple
];

/**
 * Chế độ 2D Interactive Canvas Grid (Siêu mượt 60fps - Cho máy yếu hoặc Fallback 2D Pro Max)
 * - NỀN XÁM NGỌC TRAI SANG TRỌNG: Giúp các thẻ UI nền trắng tinh khiết nổi bật bật lên (Pop out).
 * - LƯỚI PHẲNG SONG SONG MÀN HÌNH: Ngăn nắp, không có đường chéo cắt chéo qua thẻ UI.
 * - Lưới bị bẻ méo nhẹ và gợn sóng khi rơ chuột.
 * - Các chấm tròn có ĐỘ MỜ DẦN TỪ TÂM RA VIỀN (Soft Radial Bokeh Orbs).
 */
const InteractiveCanvas2D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Tọa độ chuột
        const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);

        // 1. TẠO MA TRẬN ĐỈNH LƯỚI 2D PHẲNG SONG SONG MÀN HÌNH (Screen-Aligned Grid)
        const gridStep = 32;
        const gridCols = Math.ceil(width / gridStep) + 2;
        const gridRows = Math.ceil(height / gridStep) + 2;
        
        interface GridVertex {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
        }
        const gridVertices: GridVertex[][] = [];
        for (let r = 0; r < gridRows; r++) {
            const row: GridVertex[] = [];
            for (let c = 0; c < gridCols; c++) {
                const bx = c * gridStep;
                const by = r * gridStep;
                row.push({ x: bx, y: by, baseX: bx, baseY: by });
            }
            gridVertices.push(row);
        }

        // 2. TẠO CÁC CHẤM TRÒN BOKEH ĐA SẮC SIÊU NHỎ
        interface Point2D {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            vx: number;
            vy: number;
            colorBase: string;
            fadeSpeed: number;
            fadePhase: number;
        }
        const points: Point2D[] = [];
        const targetPointCount = 130;
        for (let i = 0; i < targetPointCount; i++) {
            const rx = Math.random() * width;
            const ry = Math.random() * height;
            const colorObj = PALETTE_2D[Math.floor(Math.random() * PALETTE_2D.length)];
            points.push({
                x: rx,
                y: ry,
                baseX: rx,
                baseY: ry,
                size: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.16,
                vy: (Math.random() - 0.5) * 0.16,
                colorBase: colorObj.base,
                fadeSpeed: Math.random() * 1.2 + 0.4,
                fadePhase: Math.random() * Math.PI * 2
            });
        }

        let time = 0;
        const render = () => {
            time += 0.015;
            mouse.x += (mouse.targetX - mouse.x) * 0.15;
            mouse.y += (mouse.targetY - mouse.y) * 0.15;

            ctx.clearRect(0, 0, width, height);

            // Cập nhật vị trí bẻ méo cho ma trận đỉnh lưới trên mặt phẳng ngang/dọc
            const warpRadius = 140;
            for (let r = 0; r < gridRows; r++) {
                for (let c = 0; c < gridCols; c++) {
                    const v = gridVertices[r][c];
                    let tx = v.baseX + Math.cos(time + v.baseY * 0.02) * 1.0;
                    let ty = v.baseY + Math.sin(time + v.baseX * 0.02) * 1.0;

                    const dx = tx - mouse.x;
                    const dy = ty - mouse.y;
                    const dist = Math.hypot(dx, dy);

                    // KHI RƠ CHUỘT -> LƯỚI BỊ MÉO GIÃN NỞ TRÊN MẶT PHẲNG XY
                    if (dist < warpRadius && dist > 1) {
                        const push = Math.pow(1 - dist / warpRadius, 1.8) * 22;
                        const angle = Math.atan2(dy, dx);
                        tx += Math.cos(angle) * push;
                        ty += Math.sin(angle) * push;
                    }
                    v.x = tx;
                    v.y = ty;
                }
            }

            // Vẽ các đường kẻ lưới biến dạng mờ mảnh đồng nhất (opacity: 0.028)
            ctx.strokeStyle = "rgba(99, 102, 241, 0.028)";
            ctx.lineWidth = 0.8;
            for (let r = 0; r < gridRows; r++) {
                ctx.beginPath();
                for (let c = 0; c < gridCols; c++) {
                    const v = gridVertices[r][c];
                    if (c === 0) ctx.moveTo(v.x, v.y);
                    else ctx.lineTo(v.x, v.y);
                }
                ctx.stroke();
            }
            for (let c = 0; c < gridCols; c++) {
                ctx.beginPath();
                for (let r = 0; r < gridRows; r++) {
                    const v = gridVertices[r][c];
                    if (r === 0) ctx.moveTo(v.x, v.y);
                    else ctx.lineTo(v.x, v.y);
                }
                ctx.stroke();
            }

            // Cập nhật và vẽ các chấm có ĐỘ MỜ DẦN TỪ TÂM RA VIỀN (Radial Gradient Bokeh)
            const maxRadius = 110;
            for (let i = 0; i < points.length; i++) {
                const pt = points[i];

                pt.x += pt.vx + Math.cos(time + pt.fadePhase) * 0.05;
                pt.y += pt.vy + Math.sin(time + pt.fadePhase) * 0.05;

                if (Math.abs(pt.x - pt.baseX) > 25) pt.vx *= -1;
                if (Math.abs(pt.y - pt.baseY) > 25) pt.vy *= -1;

                const dx = pt.x - mouse.x;
                const dy = pt.y - mouse.y;
                const dist = Math.hypot(dx, dy);

                const baseAlpha = 0.12 + (Math.sin(time * pt.fadeSpeed + pt.fadePhase) + 1) * 0.3;
                let currentRadius = pt.size * 3.5;
                let opacity = baseAlpha;
                let colorPrefix = pt.colorBase;

                if (dist < maxRadius) {
                    const factor = Math.pow(1 - dist / maxRadius, 2);
                    currentRadius = pt.size * (3.5 + factor * 7.0);
                    opacity = Math.min(0.9, baseAlpha + factor * 0.75);
                }

                const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, currentRadius);
                grad.addColorStop(0, `${colorPrefix}${opacity})`);
                grad.addColorStop(0.35, `${colorPrefix}${opacity * 0.6})`);
                grad.addColorStop(0.7, `${colorPrefix}${opacity * 0.2})`);
                grad.addColorStop(1, `${colorPrefix}0)`);

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        /* NỀN XÁM NGỌC TRAI SANG TRỌNG (Pearl Slate Backdrop) giúp các thẻ UI nền trắng bật nổi 100% */
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#F0F4F8] via-[#E8EEF5] to-[#F0F4F8]">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

/**
 * Chế độ 3D WebGL Screen-Aligned Warping Wireframe Grid
 * ĐƯA LƯỚI VỀ MẶT PHẲNG SONG SONG MÀN HÌNH (XY Plane, rotation={[0, 0, 0]}).
 * Mọi đường ngang dọc đều song song với cạnh thẻ UI, không có đường chéo cắt ngang qua thẻ!
 */
const WarpingGridMesh3D: React.FC = () => {
    const planeRef = useRef<THREE.Mesh>(null);
    const geomRef = useRef<THREE.PlaneGeometry>(null);

    const initialPositions = useMemo(() => {
        const geom = new THREE.PlaneGeometry(42, 26, 56, 36);
        const pos = geom.attributes.position;
        const orig = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
            orig[i * 3] = pos.getX(i);
            orig[i * 3 + 1] = pos.getY(i);
            orig[i * 3 + 2] = pos.getZ(i);
        }
        return orig;
    }, []);

    useFrame((state) => {
        if (!geomRef.current) return;
        const time = state.clock.elapsedTime * 0.8;
        const mouseX = state.pointer.x * 16;
        const mouseY = state.pointer.y * 10;
        const warpDist = 4.2;

        const pos = geomRef.current.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const bx = initialPositions[i * 3];
            const by = initialPositions[i * 3 + 1];
            let bz = Math.sin(bx * 0.45 + time) * Math.cos(by * 0.45 + time) * 0.15;

            let tx = bx;
            let ty = by;
            const dist = Math.hypot(bx - mouseX, by - mouseY);

            // KHI RƠ CHUỘT -> BẺ MÉO VÀ GIÃN NỞ TRÊN MẶT PHẲNG XY SONG SONG MÀN HÌNH
            if (dist < warpDist && dist > 0.05) {
                const factor = Math.pow(1 - dist / warpDist, 2);
                const angle = Math.atan2(by - mouseY, bx - mouseX);
                const push = factor * 1.4;
                tx += Math.cos(angle) * push;
                ty += Math.sin(angle) * push;
                bz += factor * 0.8; // Nhô cao nhẹ
            }

            pos.setXYZ(i, tx, ty, bz);
        }
        pos.needsUpdate = true;
    });

    return (
        /* rotation={[0, 0, 0]} đảm bảo mặt lưới nằm thẳng song song màn hình cực kỳ ngăn nắp */
        <mesh ref={planeRef} position={[0, 0, -3.8]} rotation={[0, 0, 0]}>
            <planeGeometry ref={geomRef} args={[42, 26, 56, 36]} />
            <meshBasicMaterial
                color="#6366f1"
                wireframe={true}
                transparent={true}
                opacity={0.045} // Độ mờ siêu tinh tế giúp thẻ UI nổi bật hoàn toàn
            />
        </mesh>
    );
};

/**
 * Chế độ 3D WebGL Interactive Tiny Soft Dot Grid
 * Sử dụng Texture Radial Gradient (tâm sáng, viền mờ ngoài) kết hợp cùng AdditiveBlending
 * để mỗi chấm 3D trở thành một quả cầu ánh sáng bokeh mềm mại lơ lửng trên nền lưới song song.
 */
const COLS = 24;
const ROWS = 15;
const COUNT = COLS * ROWS;

const InteractiveGrid3D: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useRef(new THREE.Object3D()).current;
    const tempColor = useRef(new THREE.Color()).current;

    const radialTexture = useMemo(() => {
        if (typeof document === "undefined") return null;
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, "rgba(255, 255, 255, 1)");
            grad.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
            grad.addColorStop(0.7, "rgba(255, 255, 255, 0.15)");
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 64);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    const particlesData = useMemo(() => {
        const data = [];
        const colors = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                data.push({
                    baseX: (c - COLS / 2) * 1.3,
                    baseY: (r - ROWS / 2) * 1.3,
                    scaleMod: Math.random() * 0.9 + 0.35,
                    speedX: (Math.random() - 0.5) * 0.35,
                    speedY: (Math.random() - 0.5) * 0.35,
                    fadeSpeed: Math.random() * 1.5 + 0.5,
                    phase: Math.random() * Math.PI * 2
                });
                const hex = PALETTE_3D[Math.floor(Math.random() * PALETTE_3D.length)];
                colors.push(new THREE.Color(hex));
            }
        }
        return { data, colors };
    }, []);

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < COUNT; i++) {
            meshRef.current.setColorAt(i, particlesData.colors[i]);
        }
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    }, [particlesData]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime * 0.8;
        const mouseX = state.pointer.x * 16;
        const mouseY = state.pointer.y * 10;
        const maxDist = 4.0;

        for (let i = 0; i < COUNT; i++) {
            const pt = particlesData.data[i];
            
            const gx = pt.baseX + Math.cos(time * pt.speedX + pt.phase) * 0.45;
            const gy = pt.baseY + Math.sin(time * pt.speedY + pt.phase) * 0.45;
            let gz = Math.sin(gx * 0.5 + time) * Math.cos(gy * 0.5 + time) * 0.2 - 2.5; // Nằm phía trước lưới một chút

            const dist = Math.hypot(gx - mouseX, gy - mouseY);
            const fadePulse = 0.4 + (Math.sin(time * pt.fadeSpeed + pt.phase) + 1) * 0.3;
            let scale = pt.scaleMod * fadePulse;

            if (dist < maxDist) {
                const factor = Math.pow(1 - dist / maxDist, 2);
                scale = pt.scaleMod * (1.0 + factor * 4.5);
                gz += factor * 1.2;

                tempColor.copy(particlesData.colors[i]).multiplyScalar(1.0 + factor * 1.5);
                meshRef.current.setColorAt(i, tempColor);
            } else {
                tempColor.copy(particlesData.colors[i]).multiplyScalar(fadePulse);
                meshRef.current.setColorAt(i, tempColor);
            }

            dummy.position.set(gx, gy, gz);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.needsUpdate = true;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* LƯỚI PHẲNG SONG SONG MÀN HÌNH (Screen-Aligned Flat Grid) */}
            <WarpingGridMesh3D />

            {/* Ma trận chấm bokeh mờ dần từ tâm ra viền */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
                <planeGeometry args={[0.22, 0.22]} />
                <meshBasicMaterial
                    map={radialTexture}
                    alphaMap={radialTexture}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </instancedMesh>
        </group>
    );
};

export const BackgroundMesh3D: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const { is3D } = usePerformanceMode();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !is3D) {
        return <InteractiveCanvas2D />;
    }

    return (
        /* NỀN XÁM NGỌC TRAI SANG TRỌNG (Pearl Slate Backdrop) giúp các thẻ UI nền trắng bật nổi 100% */
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 opacity-95 bg-gradient-to-br from-[#F0F4F8] via-[#E8EEF5] to-[#F0F4F8]">
            <Suspense fallback={<InteractiveCanvas2D />}>
                <Canvas
                    camera={{ position: [0, 0, 7.5], fov: 55 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={0.9} />
                    <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
                    
                    <pointLight position={[-10, -10, 5]} intensity={2.0} color="#6366f1" distance={25} />
                    <pointLight position={[10, 10, 5]} intensity={2.0} color="#10b981" distance={25} />

                    <InteractiveGrid3D />
                </Canvas>
            </Suspense>
        </div>
    );
};
