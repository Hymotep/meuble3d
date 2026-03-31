/**
 * ============================================================================
 * ARCHITECTURE VISUAL COMPONENT
 * ============================================================================
 * * Renders a simple window visualization in the 3D scene.
 * Windows are used as architectural markers to indicate where real windows
 * are in the room - they're not functional cabinets, just reference objects.
 */

import React from "react";

// Optimisation : On sort les constantes du composant pour éviter 
// qu'elles soient redéclarées à chaque rafraîchissement d'image 3D
const FRAME_THICKNESS = 0.04;
const GLASS_INSET = 0.04;

const ArchitectureVisual = ({ w, h, d, isSelected, isColliding }) => {
    return (
        <group>
            {/* Cadre gauche */}
            <mesh position={[-w / 2 + FRAME_THICKNESS / 2, h / 2, 0]}>
                <boxGeometry args={[FRAME_THICKNESS, h, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            
            {/* Cadre droit */}
            <mesh position={[w / 2 - FRAME_THICKNESS / 2, h / 2, 0]}>
                <boxGeometry args={[FRAME_THICKNESS, h, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            
            {/* Cadre haut */}
            <mesh position={[0, h - FRAME_THICKNESS / 2, 0]}>
                <boxGeometry args={[w, FRAME_THICKNESS, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            
            {/* Cadre bas */}
            <mesh position={[0, FRAME_THICKNESS / 2, 0]}>
                <boxGeometry args={[w, FRAME_THICKNESS, d]} />
                <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            
            {/* Vitre (Verre transparent) */}
            <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[w - GLASS_INSET * 2, h - GLASS_INSET * 2, 0.02]} />
                <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
            </mesh>
            
            {/* Boîte de sélection / collision */}
            {(isSelected || isColliding) && (
                <mesh position={[0, h / 2, 0]}>
                    <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                    <meshBasicMaterial 
                        color={isColliding ? "#ef4444" : "#3b82f6"} 
                        transparent 
                        opacity={isColliding ? 0.3 : 0.8} 
                        wireframe={!isColliding} 
                    />
                </mesh>
            )}
        </group>
    );
};

export default ArchitectureVisual;