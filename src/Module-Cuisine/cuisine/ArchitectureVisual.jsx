/**
 * ============================================================================
 * ARCHITECTURE VISUAL COMPONENT
 * ============================================================================
 * 
 * Renders a simple window visualization in the 3D scene.
 * Windows are used as architectural markers to indicate where real windows
 * are in the room - they're not functional cabinets, just reference objects.
 */

import React from "react";

const ArchitectureVisual = ({ w, h, d, isSelected, isColliding }) => {
    const frameThickness = 0.04;
    const glassInset = 0.04;

    return (
        <group>
            <mesh position={[-w / 2 + frameThickness / 2, h / 2, 0]}>
                <boxGeometry args={[frameThickness, h, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[w / 2 - frameThickness / 2, h / 2, 0]}>
                <boxGeometry args={[frameThickness, h, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[0, h - frameThickness / 2, 0]}>
                <boxGeometry args={[w, frameThickness, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[0, frameThickness / 2, 0]}>
                <boxGeometry args={[w, frameThickness, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[w - glassInset * 2, h - glassInset * 2, 0.02]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
            </mesh>
            {(isSelected || isColliding) && (
                <mesh position={[0, h / 2, 0]}>
                    <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                    <meshBasicMaterial color={isColliding ? "#ef4444" : "#3b82f6"} transparent opacity={isColliding ? 0.3 : 0.8} wireframe={!isColliding} />
                </mesh>
            )}
        </group>
    );
};

export default ArchitectureVisual;
