"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { usePerformanceMode } from "@/src/core/hooks/usePerformanceMode";

interface Props {
    children?: React.ReactNode;
}

// ================= COMPONENT BIỂN 3D VẬT LÝ (TRUE 3D OCEAN) =================
const Ocean = ({ isMini = false }: { isMini?: boolean }) => {
    const geomRef = useRef<THREE.PlaneGeometry>(null);

    useFrame((state) => {
        if (!geomRef.current) return;
        
        const time = state.clock.getElapsedTime() * (isMini ? 0.5 : 1);
        const pos = geomRef.current.attributes.position;
        
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            
            const wave1 = Math.sin(x * (isMini ? 0.5 : 0.2) + time) * (isMini ? 0.3 : 0.8);
            const wave2 = Math.cos(y * (isMini ? 0.4 : 0.15) + time * 0.8) * (isMini ? 0.3 : 0.8);
            const wave3 = Math.sin((x + y) * 0.1 + time * 1.2) * (isMini ? 0.2 : 0.4);
            
            const z = wave1 + wave2 + wave3;
            pos.setZ(i, z);
        }
        
        pos.needsUpdate = true;
        geomRef.current.computeVertexNormals();
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, isMini ? -2.5 : -2, 0]}>
            {/* Nếu là mini (trong các Card), giảm số lượng đỉnh xuống 64x64 để cân bằng hiệu năng và độ mượt */}
            <planeGeometry ref={geomRef} args={isMini ? [40, 40, 64, 64] : [200, 200, 100, 100]} />
            <meshPhysicalMaterial 
                color={isMini ? "#001122" : "#004a7c"} // Màu nền của Card tối hơn (Navy Blue đen) để nổi bật chữ
                metalness={0.95}       
                roughness={0.05}       
                envMapIntensity={isMini ? 1.2 : 3.0}  // Giảm độ chói của phản xạ mặt trời trên Card
                clearcoat={1.0}        
                clearcoatRoughness={0.1}
            />
        </mesh>
    );
};

// ================= CAMERA DÀNH CHO MINI OCEAN TRONG CARD =================
const MiniCameraRig = () => {
    useFrame((state) => {
        // Nhìn hơi ngước lên để ép mặt nước xuống sát đáy của thẻ Card
        state.camera.lookAt(0, 4, -10);
    });
    return null;
}

// ================= COMPONENT BACKGROUND DÀNH CHO CÁC CARD =================
export const Card3DBackground = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90">
            <Canvas shadows dpr={[1, 1]} camera={{ fov: 60, position: [0, 2, 6] }}>
                <Suspense fallback={null}>
                    {/* Giảm cường độ ánh sáng trong Card để mặt nước trở nên TỐI, làm nổi bật chữ trắng */}
                    <ambientLight intensity={0.4} color="#a0d2eb" />
                    <directionalLight position={[100, 20, -50]} intensity={1.5} color="#ffe4b5" />
                    
                    <Environment background={false}>
                        <Sky sunPosition={[100, 20, -100]} turbidity={2.1} rayleigh={1.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
                    </Environment>

                    <Ocean isMini={true} />
                    <MiniCameraRig />
                </Suspense>
            </Canvas>
        </div>
    );
};

// ================= CAMERA & TƯƠNG TÁC CHUỘT THỰC (TRUE 3D RIG) =================
const CameraRig = () => {
    useFrame((state) => {
        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;
        
        // Mở rộng biên độ di chuyển của Camera
        const targetPosition = new THREE.Vector3(mouseX * 4, 3 + mouseY * 2, 12);
        state.camera.position.lerp(targetPosition, 0.05);
        
        // QUAN TRỌNG: Để mặt biển và gợn sóng chỉ xuất hiện sát dưới đáy màn hình,
        // Ta cần cho Camera "ngước nhìn lên bầu trời" (y = 20 thay vì 2).
        // Khi Camera ngước lên, đường chân trời và mặt nước sẽ bị đẩy tuột xuống góc dưới cùng!
        state.camera.lookAt(0, 25, -50);
    });
    return null;
};

export default function Immersive3DBackground({ children }: Props) {
    const { is3D } = usePerformanceMode();

    return (
        <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-1000 ${
            is3D ? "bg-black" : "bg-gray-50"
        }`}>
            {is3D && (
                <div className="absolute inset-0 w-full h-full z-0">
                    <Canvas shadows dpr={[1, 2]} camera={{ fov: 60, position: [0, 3, 12] }}>
                        <Suspense fallback={null}>
                            {/* Ánh sáng vật lý */}
                            <ambientLight intensity={0.8} color="#a0d2eb" />
                            <directionalLight position={[100, 20, -50]} intensity={3} color="#ffe4b5" />
                            
                            {/* Môi trường 3D Tự Sinh (Procedural Sky) - Không dùng ảnh tải từ mạng */}
                            {/* Bọc Sky trong Environment để mặt nước dùng bầu trời làm ảnh phản chiếu */}
                            <Environment background resolution={256}>
                                <Sky 
                                    sunPosition={[100, 20, -100]} // Vị trí mặt trời lúc hoàng hôn/bình minh
                                    turbidity={2.1}               // Độ đục của không khí
                                    rayleigh={1.5}                // Tán xạ ánh sáng (tạo màu hoàng hôn)
                                    mieCoefficient={0.005} 
                                    mieDirectionalG={0.8}
                                />
                            </Environment>
                            
                            <Ocean />
                            <CameraRig />
                        </Suspense>
                    </Canvas>
                </div>
            )}

            {/* ================= MAIN FOREGROUND ================= */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
