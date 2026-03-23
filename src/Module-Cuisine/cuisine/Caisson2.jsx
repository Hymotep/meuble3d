/**
 * ============================================================================
 * CAISSON 2 (CABINET) COMPONENT
 * ============================================================================
 * * Highly configurable 3D cabinet component for the kitchen configurator.
 * Contains:
 * - Dynamic dimension calculations (width, height, depth)
 * - PBR Texture loading and wrapping setup
 * - Conditional material generation (solid colors vs. realistic textures)
 * - Multiple structural variants: Island, Base Cabinet, and Tall Cabinet
 * - Integrated equipment logic (Oven/Microwave, Sink, Cooktop)
 * - Visual feedback for interactive states (Selected, Colliding)
 */

import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useTexture, Edges } from "@react-three/drei";

export const Caisson2 = ({
    largeur = 600,
    hauteur = 812,
    profondeur = 600,
    isSelected = false,
    isColliding = false,
    couleurExt = "#ffffff",
    couleurInt = "#e5e7eb",
    avecPoignees = true,
    couleurPoignees = "#222222",
    type = "base_cabinet",
    couleurPlanTravail = "#daba9e",
    isTiroirsInterieurs = false,
    equipement = "none",
    useTextures = false
}) => {
    
    // Load PBR textures for realistic rendering
    // These are applied conditionally based on the useTextures prop
    const textures = useTexture({
        woodMap: "public/textures/oak/chene_color.jpg",
        woodRough: "public/textures/oak/chene_roughness.jpg",
        woodNormal: "public/textures/oak/chene_normal.jpg",
        marbleMap: "public/textures/oak/chene_color.jpg",
        marbleRough: "public/textures/oak/chene_color.jpg",
        metalNormal: "public/textures/oak/chene_color.jpg",
    });

    // Configure texture wrapping behavior
    // Textures from useTexture are mutable, allowing us to set RepeatWrapping
    useEffect(() => {
        textures.woodMap.wrapS = textures.woodMap.wrapT = THREE.RepeatWrapping;
        textures.woodMap.repeat.set(1, 2);
        textures.woodNormal.wrapS = textures.woodNormal.wrapT = THREE.RepeatWrapping;
        textures.woodNormal.repeat.set(1, 2);
    }, [textures]);

    // Memoized facade material to prevent unnecessary recalculations
    // Switches between standard colors and PBR wood textures
    const facadeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: useTextures ? "#ffffff" : couleurExt,
        map: useTextures ? textures.woodMap : null,
        roughnessMap: useTextures ? textures.woodRough : null,
        normalMap: useTextures ? textures.woodNormal : null,
        normalScale: useTextures ? new THREE.Vector2(0.5, 0.5) : new THREE.Vector2(0, 0),
        roughness: useTextures ? 0.7 : 0.4,
        metalness: 0.05,
    }), [textures, useTextures, couleurExt]);

    // Memoized worktop material 
    const worktopMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: useTextures ? "#ffffff" : couleurPlanTravail,
        map: useTextures ? textures.marbleMap : null,
        roughnessMap: useTextures ? textures.marbleRough : null,
        roughness: useTextures ? 0.1 : 0.4,
        metalness: 0.0,
        envMapIntensity: useTextures ? 1.5 : 1.0,
    }), [textures, useTextures, couleurPlanTravail]);

    // Memoized handle material
    const handleMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: useTextures ? "#d1d5db" : couleurPoignees,
        normalMap: useTextures ? textures.metalNormal : null,
        normalScale: useTextures ? new THREE.Vector2(1.5, 1.5) : new THREE.Vector2(0, 0),
        roughness: useTextures ? 0.3 : 0.2,
        metalness: useTextures ? 1.0 : 0.8,
    }), [textures, useTextures, couleurPoignees]);

    // Convert dimensions from millimeters to meters for Three.js scaling
    const w = largeur / 1000;
    const h = hauteur / 1000;
    const d = profondeur / 1000;

    // Standard structural constants
    const doorThickness = 0.02;
    const gap = 0.004;

    // Component type flags
    const isBase = type === "base_cabinet";
    const isTall = type === "tall_cabinet";
    const isIsland = type === "island";
    
    // Calculate vertical segmentation
    const plintheH = (isBase || isTall || isIsland) ? 0.15 : 0; 
    const planH = (isBase || isIsland) ? 0.038 : 0; 
    const corpsH = h - plintheH - planH; 
    const bottomY = -h / 2;

    // ============================================================================
    // 1. PREMIUM ISLAND RENDERING (ÎLOT CENTRAL)
    // ============================================================================
    if (isIsland) {
        const bodyD = d * 0.65; 
        const bodyZ = (d / 2) - (bodyD / 2);

        // Determine column count based on island width
        const nbCols = w > 1.5 ? 3 : 2; 
        const colW = (w - (gap * (nbCols + 1))) / nbCols;
        const startX = -w / 2 + colW / 2 + gap;

        return (
            <group position={[w / 2, h / 2, d / 2]}>
                
                {/* ======================== */}
                {/* ISLAND BASE & STRUCTURE */}
                {/* ======================== */}
                <mesh position={[0, bottomY + plintheH / 2, bodyZ - 0.02]}><boxGeometry args={[w - 0.04, plintheH, bodyD - 0.04]} /><primitive object={facadeMaterial} attach="material" /></mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[w - 0.042, corpsH - 0.002, bodyD - 0.022]} /><meshStandardMaterial color={couleurInt} roughness={0.9} /></mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, bodyZ - bodyD / 2 - 0.01]}><boxGeometry args={[w, corpsH, 0.02]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>
                <mesh position={[-w/2 + 0.01, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[0.02, corpsH, bodyD]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>
                <mesh position={[w/2 - 0.01, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[0.02, corpsH, bodyD]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>

                {/* ======================== */}
                {/* ISLAND COLUMNS & DOORS */}
                {/* ======================== */}
                {Array.from({ length: nbCols }).map((_, i) => {
                    const cx = startX + i * (colW + gap);
                    return (
                        <group key={i}>
                            <mesh position={[cx, bottomY + plintheH + corpsH*0.85, bodyZ + bodyD/2 + doorThickness/2 + 0.002]}><boxGeometry args={[colW, corpsH*0.3 - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /></mesh>
                            <mesh position={[cx, bottomY + plintheH + corpsH*0.35, bodyZ + bodyD/2 + doorThickness/2 + 0.002]}><boxGeometry args={[colW, corpsH*0.7 - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /></mesh>
                            {avecPoignees && (
                                <>
                                    <mesh position={[cx, bottomY + plintheH + corpsH*0.85 + 0.05, bodyZ + bodyD/2 + doorThickness + 0.015]}><boxGeometry args={[colW * 0.5, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>
                                    <mesh position={[cx, bottomY + plintheH + corpsH*0.35 + 0.25, bodyZ + bodyD/2 + doorThickness + 0.015]}><boxGeometry args={[colW * 0.5, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>
                                </>
                            )}
                        </group>
                    );
                })}

                {/* ======================== */}
                {/* ISLAND WORKTOP */}
                {/* ======================== */}
                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0]}><boxGeometry args={[w + 0.04, planH, d + 0.04]} /><primitive object={worktopMaterial} attach="material" /></mesh>

                {/* ======================== */}
                {/* ISLAND EQUIPMENT */}
                {/* ======================== */}
                {equipement === "sink" && (
                    <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, bodyZ]}>
                        <mesh position={[0, 0, 0]}><boxGeometry args={[0.7, 0.01, 0.45]} /><meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} /></mesh>
                        <mesh position={[0, 0.15, -0.15]}><cylinderGeometry args={[0.015, 0.015, 0.3]} /><meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} /></mesh>
                    </group>
                )}
                {equipement === "cooktop" && (
                    <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, bodyZ]}>
                        <mesh position={[0, 0, 0]}><boxGeometry args={[0.7, 0.01, 0.45]} /><meshStandardMaterial color="#111827" roughness={0.1} /></mesh>
                        <mesh position={[-0.15, 0.006, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.001]} /><meshBasicMaterial color="#ef4444" /></mesh>
                        <mesh position={[0.15, 0.006, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.001]} /><meshBasicMaterial color="#ef4444" /></mesh>
                    </group>
                )}

                {/* ======================== */}
                {/* ISLAND INTERACTION BOX */}
                {/* ======================== */}
                {(isSelected || isColliding) && (
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                        <meshBasicMaterial color={isColliding ? "#ef4444" : "#3b82f6"} transparent opacity={isColliding ? 0.3 : 0.8} wireframe={!isColliding} />
                    </mesh>
                )}
            </group>
        );
    }

    // ============================================================================
    // 2. CLASSIC & TALL CABINET RENDERING
    // ============================================================================
    const t1H = corpsH * 0.2;
    const t2H = corpsH * 0.4;
    const t3H = corpsH * 0.4;

    const bottomDoorH = 0.7; 
    const ovenH = 0.6; 
    const mwH = 0.38; 
    const topDoorH = corpsH - bottomDoorH - ovenH - mwH; 
    const doorZ = (d / 2) - (doorThickness / 2) + 0.002;

    return (
        <group position={[w / 2, h / 2, d / 2]}>
            
            {/* ======================== */}
            {/* BASE & BODY STRUCTURE */}
            {/* ======================== */}
            {(isBase || isTall) && (
                <mesh position={[0, bottomY + plintheH / 2, -0.02]}>
                    <boxGeometry args={[w, plintheH, d - 0.04]} />
                    <primitive object={facadeMaterial} attach="material" />
                </mesh>
            )}

            <mesh position={[0, bottomY + plintheH + corpsH / 2, -doorThickness / 2]}>
                <boxGeometry args={[w - 0.002, corpsH - 0.002, d - doorThickness - 0.002]} />
                <meshStandardMaterial color={couleurInt} roughness={0.9} />
                <Edges color="#cccccc" opacity={0.5} transparent />
            </mesh>

            {/* ======================== */}
            {/* TALL CABINET W/ APPLIANCES */}
            {/* ======================== */}
            {isTall && equipement === "oven_microwave" ? (
                <group>
                    <mesh position={[0, bottomY + plintheH + bottomDoorH/2, doorZ]}><boxGeometry args={[w - gap, bottomDoorH - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + bottomDoorH - 0.06, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}

                    {/* Oven Segment */}
                    <group position={[0, bottomY + plintheH + bottomDoorH + ovenH/2, doorZ]}>
                        <mesh><boxGeometry args={[w - gap, ovenH - gap, doorThickness]} /><meshStandardMaterial color="#111827" /></mesh>
                        <mesh position={[0, -0.05, 0.004]}><boxGeometry args={[w * 0.8, ovenH * 0.6, doorThickness]} /><meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} /></mesh>
                        <mesh position={[0, 0.2, 0.02]}><boxGeometry args={[w * 0.7, 0.015, 0.02]} /><meshStandardMaterial color="#d1d5db" metalness={0.8} /></mesh>
                    </group>

                    {/* Microwave Segment */}
                    <group position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH/2, doorZ]}>
                        <mesh><boxGeometry args={[w - gap, mwH - gap, doorThickness]} /><meshStandardMaterial color="#111827" /></mesh>
                        <mesh position={[-w * 0.1, 0, 0.004]}><boxGeometry args={[w * 0.6, mwH * 0.7, doorThickness]} /><meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} /></mesh>
                        <mesh position={[w * 0.35, 0, 0.004]}><boxGeometry args={[w * 0.15, mwH * 0.7, doorThickness]} /><meshStandardMaterial color="#1f2937" /></mesh>
                        <mesh position={[w * 0.35, 0.1, 0.006]}><boxGeometry args={[w * 0.1, 0.05, doorThickness]} /><meshBasicMaterial color="#34d399" /></mesh>
                    </group>

                    <mesh position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH + topDoorH/2, doorZ]}><boxGeometry args={[w - gap, topDoorH - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH + 0.06, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}
                </group>

            ) : !isTiroirsInterieurs ? (
                
                // ======================== //
                // SINGLE DOOR CABINET
                // ======================== //
                <group>
                    <mesh position={[0, bottomY + plintheH + corpsH / 2, doorZ]}><boxGeometry args={[w - gap, corpsH - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + corpsH / 2 + (isBase ? (corpsH / 2 - 0.06) : (-corpsH / 2 + 0.06)), doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}
                </group>
            ) : (
                
                // ======================== //
                // MULTI-DRAWER CABINET
                // ======================== //
                <group>
                    <mesh position={[0, bottomY + plintheH + t3H + t2H + t1H/2, doorZ]}><boxGeometry args={[w - gap, t1H - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H + t2H + t1H/2, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}

                    <mesh position={[0, bottomY + plintheH + t3H + t2H/2, doorZ]}><boxGeometry args={[w - gap, t2H - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H + t2H/2 + 0.1, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}

                    <mesh position={[0, bottomY + plintheH + t3H/2, doorZ]}><boxGeometry args={[w - gap, t3H - gap, doorThickness]} /><primitive object={facadeMaterial} attach="material" /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H/2 + 0.1, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><primitive object={handleMaterial} attach="material" /></mesh>}
                </group>
            )}

            {/* ======================== */}
            {/* BASE CABINET WORKTOP */}
            {/* ======================== */}
            {isBase && (
                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0.01]}>
                    <boxGeometry args={[w + 0.002, planH, d + 0.02]} />
                    <primitive object={worktopMaterial} attach="material" />
                </mesh>
            )}

            {/* ======================== */}
            {/* BASE CABINET EQUIPMENT */}
            {/* ======================== */}
            {isBase && equipement === "sink" && (
                <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, 0.05]}>
                    <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.8, 0.01, d * 0.7]} /><meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} /></mesh>
                    <mesh position={[0, 0.15, -d * 0.25]}><cylinderGeometry args={[0.015, 0.015, 0.3]} /><meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} /></mesh>
                </group>
            )}
            {isBase && equipement === "cooktop" && (
                <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, 0.05]}>
                    <mesh position={[0, 0, 0]}><boxGeometry args={[w * 0.8, 0.01, d * 0.7]} /><meshStandardMaterial color="#111827" roughness={0.1} /></mesh>
                    <mesh position={[-w * 0.2, 0.006, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.001]} /><meshBasicMaterial color="#ef4444" /></mesh>
                    <mesh position={[w * 0.2, 0.006, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.001]} /><meshBasicMaterial color="#ef4444" /></mesh>
                </group>
            )}

            {/* ======================== */}
            {/* INTERACTION BOUNDING BOX */}
            {/* ======================== */}
            {(isSelected || isColliding) && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                    <meshBasicMaterial color={isColliding ? "#ef4444" : "#3b82f6"} transparent opacity={isColliding ? 0.3 : 0.8} wireframe={!isColliding} />
                </mesh>
            )}
        </group>
    );
};