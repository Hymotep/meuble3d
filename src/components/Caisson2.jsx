import React from "react";
import { Edges } from "@react-three/drei";

export const Caisson2 = ({
    largeur = 600,
    hauteur = 812,
    profondeur = 600,
    isSelected = false,
    couleurExt = "#ffffff", // Façades
    couleurInt = "#e5e7eb", // Structure du meuble
    avecPoignees = true,
    couleurPoignees = "#222222",
    type = "base_cabinet",
    couleurPlanTravail = "#daba9e",
    isTiroirsInterieurs = false,
    equipement = "none" 
}) => {
    const w = largeur / 1000;
    const h = hauteur / 1000;
    const d = profondeur / 1000;

    const doorThickness = 0.02;
    const gap = 0.004;

    const isBase = type === "base_cabinet";
    const isTall = type === "tall_cabinet";
    const isIsland = type === "island";
    
    const plintheH = (isBase || isTall || isIsland) ? 0.15 : 0; 
    const planH = (isBase || isIsland) ? 0.038 : 0; 
    const corpsH = h - plintheH - planH; 
    
    const bottomY = -h / 2;

    // --- 1. RENDU DE L'ÎLOT CENTRAL PREMIUM ---
    if (isIsland) {
        const bodyD = d * 0.65; 
        const bodyZ = (d / 2) - (bodyD / 2);

        const nbCols = w > 1.5 ? 3 : 2; 
        const colW = (w - (gap * (nbCols + 1))) / nbCols;
        const startX = -w / 2 + colW / 2 + gap;

        return (
            <group position={[w / 2, h / 2, d / 2]}>
                <mesh position={[0, bottomY + plintheH / 2, bodyZ - 0.02]}><boxGeometry args={[w - 0.04, plintheH, bodyD - 0.04]} /><meshStandardMaterial color="#1f2937" roughness={0.9} /></mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[w - 0.042, corpsH - 0.002, bodyD - 0.022]} /><meshStandardMaterial color={couleurInt} roughness={0.9} /></mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, bodyZ - bodyD / 2 - 0.01]}><boxGeometry args={[w, corpsH, 0.02]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>
                <mesh position={[-w/2 + 0.01, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[0.02, corpsH, bodyD]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>
                <mesh position={[w/2 - 0.01, bottomY + plintheH + corpsH / 2, bodyZ]}><boxGeometry args={[0.02, corpsH, bodyD]} /><meshStandardMaterial color={couleurInt} roughness={0.3} /></mesh>

                {Array.from({ length: nbCols }).map((_, i) => {
                    const cx = startX + i * (colW + gap);
                    return (
                        <group key={i}>
                            <mesh position={[cx, bottomY + plintheH + corpsH*0.85, bodyZ + bodyD/2 + doorThickness/2 + 0.002]}><boxGeometry args={[colW, corpsH*0.3 - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /></mesh>
                            <mesh position={[cx, bottomY + plintheH + corpsH*0.35, bodyZ + bodyD/2 + doorThickness/2 + 0.002]}><boxGeometry args={[colW, corpsH*0.7 - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /></mesh>
                            {avecPoignees && (
                                <>
                                    <mesh position={[cx, bottomY + plintheH + corpsH*0.85 + 0.05, bodyZ + bodyD/2 + doorThickness + 0.015]}><boxGeometry args={[colW * 0.5, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>
                                    <mesh position={[cx, bottomY + plintheH + corpsH*0.35 + 0.25, bodyZ + bodyD/2 + doorThickness + 0.015]}><boxGeometry args={[colW * 0.5, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>
                                </>
                            )}
                        </group>
                    );
                })}

                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0]}><boxGeometry args={[w + 0.04, planH, d + 0.04]} /><meshStandardMaterial color={couleurPlanTravail} roughness={0.4} /></mesh>

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

                {isSelected && <mesh position={[0, 0, 0]}><boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} /><meshBasicMaterial color="#3b82f6" wireframe /></mesh>}
            </group>
        );
    }

    // --- 2. RENDU D'UN MEUBLE CLASSIQUE / COLONNE ---
    const t1H = corpsH * 0.2;
    const t2H = corpsH * 0.4;
    const t3H = corpsH * 0.4;

    // Calculs spécifiques pour la Colonne avec Four
    const bottomDoorH = 0.7; // Porte du bas de 70cm (alignée avec les autres meubles)
    const ovenH = 0.6; // Four standard de 60cm
    const mwH = 0.38; // Micro-ondes de 38cm
    const topDoorH = corpsH - bottomDoorH - ovenH - mwH; // Reste pour la porte du haut
    const doorZ = (d / 2) - (doorThickness / 2) + 0.002;

    return (
        <group position={[w / 2, h / 2, d / 2]}>
            {(isBase || isTall) && (
                <mesh position={[0, bottomY + plintheH / 2, -0.02]}>
                    <boxGeometry args={[w, plintheH, d - 0.04]} />
                    <meshStandardMaterial color="#1f2937" roughness={0.9} />
                </mesh>
            )}

            <mesh position={[0, bottomY + plintheH + corpsH / 2, -doorThickness / 2]}>
                <boxGeometry args={[w - 0.002, corpsH - 0.002, d - doorThickness - 0.002]} />
                <meshStandardMaterial color={couleurInt} roughness={0.9} />
                <Edges color="#cccccc" opacity={0.5} transparent />
            </mesh>

            {/* NOUVEAU : LA LOGIQUE DE LA FAÇADE */}
            {isTall && equipement === "oven_microwave" ? (
                <group>
                    {/* PORTE DU BAS */}
                    <mesh position={[0, bottomY + plintheH + bottomDoorH/2, doorZ]}><boxGeometry args={[w - gap, bottomDoorH - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + bottomDoorH - 0.06, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>}

                    {/* FOUR ENCASTRÉ */}
                    <group position={[0, bottomY + plintheH + bottomDoorH + ovenH/2, doorZ]}>
                        <mesh><boxGeometry args={[w - gap, ovenH - gap, doorThickness]} /><meshStandardMaterial color="#111827" /></mesh>
                        <mesh position={[0, -0.05, 0.004]}><boxGeometry args={[w * 0.8, ovenH * 0.6, doorThickness]} /><meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} /></mesh>
                        <mesh position={[0, 0.2, 0.02]}><boxGeometry args={[w * 0.7, 0.015, 0.02]} /><meshStandardMaterial color="#d1d5db" metalness={0.8} /></mesh>
                    </group>

                    {/* MICRO-ONDES ENCASTRÉ */}
                    <group position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH/2, doorZ]}>
                        <mesh><boxGeometry args={[w - gap, mwH - gap, doorThickness]} /><meshStandardMaterial color="#111827" /></mesh>
                        {/* Vitre gauche */}
                        <mesh position={[-w * 0.1, 0, 0.004]}><boxGeometry args={[w * 0.6, mwH * 0.7, doorThickness]} /><meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} /></mesh>
                        {/* Panneau de contrôle droit */}
                        <mesh position={[w * 0.35, 0, 0.004]}><boxGeometry args={[w * 0.15, mwH * 0.7, doorThickness]} /><meshStandardMaterial color="#1f2937" /></mesh>
                        <mesh position={[w * 0.35, 0.1, 0.006]}><boxGeometry args={[w * 0.1, 0.05, doorThickness]} /><meshBasicMaterial color="#34d399" /></mesh>
                    </group>

                    {/* PORTE DU HAUT */}
                    <mesh position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH + topDoorH/2, doorZ]}><boxGeometry args={[w - gap, topDoorH - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + bottomDoorH + ovenH + mwH + 0.06, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>}
                </group>

            ) : !isTiroirsInterieurs ? (
                // PORTE SIMPLE STANDARD
                <group>
                    <mesh position={[0, bottomY + plintheH + corpsH / 2, doorZ]}><boxGeometry args={[w - gap, corpsH - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} metalness={0.1} /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + corpsH / 2 + (isBase ? (corpsH / 2 - 0.06) : (-corpsH / 2 + 0.06)), doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} roughness={0.2} /></mesh>}
                </group>
            ) : (
                // CASSEROLIER
                <group>
                    <mesh position={[0, bottomY + plintheH + t3H + t2H + t1H/2, doorZ]}><boxGeometry args={[w - gap, t1H - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H + t2H + t1H/2, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>}

                    <mesh position={[0, bottomY + plintheH + t3H + t2H/2, doorZ]}><boxGeometry args={[w - gap, t2H - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H + t2H/2 + 0.1, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>}

                    <mesh position={[0, bottomY + plintheH + t3H/2, doorZ]}><boxGeometry args={[w - gap, t3H - gap, doorThickness]} /><meshStandardMaterial color={couleurExt} roughness={0.3} /><Edges color="#000000" opacity={0.1} transparent /></mesh>
                    {avecPoignees && <mesh position={[0, bottomY + plintheH + t3H/2 + 0.1, doorZ + 0.015]}><boxGeometry args={[w * 0.4, 0.01, 0.02]} /><meshStandardMaterial color={couleurPoignees} metalness={0.7} /></mesh>}
                </group>
            )}

            {isBase && (
                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0.01]}>
                    <boxGeometry args={[w + 0.002, planH, d + 0.02]} />
                    <meshStandardMaterial color={couleurPlanTravail} roughness={0.6} />
                </mesh>
            )}

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

            {isSelected && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                    <meshBasicMaterial color="#3b82f6" wireframe />
                </mesh>
            )}
        </group>
    );
};