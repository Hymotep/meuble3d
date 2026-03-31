/**
 * ============================================================================
 * CAISSON 2 (CABINET) COMPONENT
 * ============================================================================
 * Highly configurable 3D cabinet component for the kitchen configurator.
 * (Logic extracted to useCabinetMaterials and cabinetLayout)
 */

import React from "react";
import { Edges } from "@react-three/drei";
import { Dishwasher } from "../appliance/Dishwasher";
import { useCabinetMaterials } from "../hooks/CaissonCuisine/useCabinetMaterials";
import { getCabinetLayout } from "../../utils/CaissonCuisine/cabinetLayout";

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
    useTextures = false,
}) => {
    // 1. Initialisation des matériaux (Hook externe)
    const { facadeMaterial, worktopMaterial, handleMaterial } = useCabinetMaterials({
        useTextures,
        couleurExt,
        couleurPlanTravail,
        couleurPoignees
    });

    // 2. Récupération de tous les calculs mathématiques (Utilitaire externe)
    const layout = getCabinetLayout(largeur, hauteur, profondeur, type, equipement);
    const { 
        w, h, d, doorThickness, gap, 
        isBase, isTall, isIsland, isDishwasher, 
        plintheH, planH, corpsH, bottomY, 
        island, tall 
    } = layout;

    // ============================================================================
    // 1. PREMIUM ISLAND RENDERING (ÎLOT CENTRAL)
    // ============================================================================
    if (isIsland) {
        return (
            <group position={[w / 2, h / 2, d / 2]}>
                {/* ISLAND BASE & STRUCTURE */}
                <mesh position={[0, bottomY + plintheH / 2, island.bodyZ - 0.02]}>
                    <boxGeometry args={[w - 0.04, plintheH, island.bodyD - 0.04]} />
                    <primitive object={facadeMaterial} attach="material" />
                </mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, island.bodyZ]}>
                    <boxGeometry args={[w - 0.042, corpsH - 0.002, island.bodyD - 0.022]} />
                    <meshStandardMaterial color={couleurInt} roughness={0.9} />
                </mesh>
                <mesh position={[0, bottomY + plintheH + corpsH / 2, island.bodyZ - island.bodyD / 2 - 0.01]}>
                    <boxGeometry args={[w, corpsH, 0.02]} />
                    <meshStandardMaterial color={couleurInt} roughness={0.3} />
                </mesh>
                <mesh position={[-w / 2 + 0.01, bottomY + plintheH + corpsH / 2, island.bodyZ]}>
                    <boxGeometry args={[0.02, corpsH, island.bodyD]} />
                    <meshStandardMaterial color={couleurInt} roughness={0.3} />
                </mesh>
                <mesh position={[w / 2 - 0.01, bottomY + plintheH + corpsH / 2, island.bodyZ]}>
                    <boxGeometry args={[0.02, corpsH, island.bodyD]} />
                    <meshStandardMaterial color={couleurInt} roughness={0.3} />
                </mesh>

                {/* ISLAND COLUMNS & DOORS */}
                {Array.from({ length: island.nbCols }).map((_, i) => {
                    const cx = island.startX + i * (island.colW + gap);
                    return (
                        <group key={i}>
                            <mesh position={[cx, bottomY + plintheH + corpsH * 0.85, island.bodyZ + island.bodyD / 2 + doorThickness / 2 + 0.002]}>
                                <boxGeometry args={[island.colW, corpsH * 0.3 - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                            </mesh>
                            <mesh position={[cx, bottomY + plintheH + corpsH * 0.35, island.bodyZ + island.bodyD / 2 + doorThickness / 2 + 0.002]}>
                                <boxGeometry args={[island.colW, corpsH * 0.7 - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                            </mesh>
                            {avecPoignees && (
                                <>
                                    <mesh position={[cx, bottomY + plintheH + corpsH * 0.85 + 0.05, island.bodyZ + island.bodyD / 2 + doorThickness + 0.015]}>
                                        <boxGeometry args={[island.colW * 0.5, 0.01, 0.02]} />
                                        <primitive object={handleMaterial} attach="material" />
                                    </mesh>
                                    <mesh position={[cx, bottomY + plintheH + corpsH * 0.35 + 0.25, island.bodyZ + island.bodyD / 2 + doorThickness + 0.015]}>
                                        <boxGeometry args={[island.colW * 0.5, 0.01, 0.02]} />
                                        <primitive object={handleMaterial} attach="material" />
                                    </mesh>
                                </>
                            )}
                        </group>
                    );
                })}

                {/* ISLAND WORKTOP */}
                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0]}>
                    <boxGeometry args={[w + 0.04, planH, d + 0.04]} />
                    <primitive object={worktopMaterial} attach="material" />
                </mesh>

                {/* ISLAND EQUIPMENT */}
                {equipement === "sink" && (
                    <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, island.bodyZ]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[0.7, 0.01, 0.45]} />
                            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
                        </mesh>
                        <mesh position={[0, 0.15, -0.15]}>
                            <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                            <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
                        </mesh>
                    </group>
                )}
                {equipement === "cooktop" && (
                    <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, island.bodyZ]}>
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[0.7, 0.01, 0.45]} />
                            <meshStandardMaterial color="#111827" roughness={0.1} />
                        </mesh>
                        <mesh position={[-0.15, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.08, 0.08, 0.001]} />
                            <meshBasicMaterial color="#ef4444" />
                        </mesh>
                        <mesh position={[0.15, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.06, 0.06, 0.001]} />
                            <meshBasicMaterial color="#ef4444" />
                        </mesh>
                    </group>
                )}

                {/* ISLAND INTERACTION BOX */}
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
    return (
        <group position={[w / 2, h / 2, d / 2]}>
            {isDishwasher ? (
                <Dishwasher largeur={largeur} hauteur={hauteur - planH * 1000} profondeur={profondeur} />
            ) : (
                <>
                    {/* BASE & BODY STRUCTURE */}
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

                    {/* TALL CABINET W/ APPLIANCES */}
                    {isTall && equipement === "oven_microwave" ? (
                        <group>
                            <mesh position={[0, bottomY + plintheH + tall.bottomDoorH / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, tall.bottomDoorH - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + tall.bottomDoorH - 0.06, tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}

                            {/* Oven Segment */}
                            <group position={[0, bottomY + plintheH + tall.bottomDoorH + tall.ovenH / 2, tall.doorZ]}>
                                <mesh>
                                    <boxGeometry args={[w - gap, tall.ovenH - gap, doorThickness]} />
                                    <meshStandardMaterial color="#111827" />
                                </mesh>
                                <mesh position={[0, -0.05, 0.004]}>
                                    <boxGeometry args={[w * 0.8, tall.ovenH * 0.6, doorThickness]} />
                                    <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} />
                                </mesh>
                                <mesh position={[0, 0.2, 0.02]}>
                                    <boxGeometry args={[w * 0.7, 0.015, 0.02]} />
                                    <meshStandardMaterial color="#d1d5db" metalness={0.8} />
                                </mesh>
                            </group>

                            {/* Microwave Segment */}
                            <group position={[0, bottomY + plintheH + tall.bottomDoorH + tall.ovenH + tall.mwH / 2, tall.doorZ]}>
                                <mesh>
                                    <boxGeometry args={[w - gap, tall.mwH - gap, doorThickness]} />
                                    <meshStandardMaterial color="#111827" />
                                </mesh>
                                <mesh position={[-w * 0.1, 0, 0.004]}>
                                    <boxGeometry args={[w * 0.6, tall.mwH * 0.7, doorThickness]} />
                                    <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.1} />
                                </mesh>
                                <mesh position={[w * 0.35, 0, 0.004]}>
                                    <boxGeometry args={[w * 0.15, tall.mwH * 0.7, doorThickness]} />
                                    <meshStandardMaterial color="#1f2937" />
                                </mesh>
                                <mesh position={[w * 0.35, 0.1, 0.006]}>
                                    <boxGeometry args={[w * 0.1, 0.05, doorThickness]} />
                                    <meshBasicMaterial color="#34d399" />
                                </mesh>
                            </group>

                            <mesh position={[0, bottomY + plintheH + tall.bottomDoorH + tall.ovenH + tall.mwH + tall.topDoorH / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, tall.topDoorH - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + tall.bottomDoorH + tall.ovenH + tall.mwH + 0.06, tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}
                        </group>
                    ) : !isTiroirsInterieurs ? (
                        // SINGLE DOOR CABINET
                        <group>
                            <mesh position={[0, bottomY + plintheH + corpsH / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, corpsH - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                                <Edges color="#000000" opacity={0.1} transparent />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + corpsH / 2 + (isBase ? corpsH / 2 - 0.06 : -corpsH / 2 + 0.06), tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}
                        </group>
                    ) : (
                        // MULTI-DRAWER CABINET
                        <group>
                            <mesh position={[0, bottomY + plintheH + tall.t3H + tall.t2H + tall.t1H / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, tall.t1H - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                                <Edges color="#000000" opacity={0.1} transparent />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + tall.t3H + tall.t2H + tall.t1H / 2, tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}

                            <mesh position={[0, bottomY + plintheH + tall.t3H + tall.t2H / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, tall.t2H - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                                <Edges color="#000000" opacity={0.1} transparent />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + tall.t3H + tall.t2H / 2 + 0.1, tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}

                            <mesh position={[0, bottomY + plintheH + tall.t3H / 2, tall.doorZ]}>
                                <boxGeometry args={[w - gap, tall.t3H - gap, doorThickness]} />
                                <primitive object={facadeMaterial} attach="material" />
                                <Edges color="#000000" opacity={0.1} transparent />
                            </mesh>
                            {avecPoignees && (
                                <mesh position={[0, bottomY + plintheH + tall.t3H / 2 + 0.1, tall.doorZ + 0.015]}>
                                    <boxGeometry args={[w * 0.4, 0.01, 0.02]} />
                                    <primitive object={handleMaterial} attach="material" />
                                </mesh>
                            )}
                        </group>
                    )}
                </>
            )}

            {/* BASE CABINET WORKTOP */}
            {isBase && (
                <mesh position={[0, bottomY + plintheH + corpsH + planH / 2, 0.01]}>
                    <boxGeometry args={[w + 0.002, planH, d + 0.02]} />
                    <primitive object={worktopMaterial} attach="material" />
                </mesh>
            )}

            {/* BASE CABINET EQUIPMENT */}
            {isBase && equipement === "sink" && (
                <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, 0.05]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[w * 0.8, 0.01, d * 0.7]} />
                        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0.15, -d * 0.25]}>
                        <cylinderGeometry args={[0.015, 0.015, 0.3]} />
                        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
                    </mesh>
                </group>
            )}
            {isBase && equipement === "cooktop" && (
                <group position={[0, bottomY + plintheH + corpsH + planH + 0.006, 0.05]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[w * 0.8, 0.01, d * 0.7]} />
                        <meshStandardMaterial color="#111827" roughness={0.1} />
                    </mesh>
                    <mesh position={[-w * 0.2, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.001]} />
                        <meshBasicMaterial color="#ef4444" />
                    </mesh>
                    <mesh position={[w * 0.2, 0.006, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.06, 0.06, 0.001]} />
                        <meshBasicMaterial color="#ef4444" />
                    </mesh>
                </group>
            )}

            {/* INTERACTION BOUNDING BOX */}
            {(isSelected || isColliding) && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[w + 0.005, h + 0.005, d + 0.005]} />
                    <meshBasicMaterial color={isColliding ? "#ef4444" : "#3b82f6"} transparent opacity={isColliding ? 0.3 : 0.8} wireframe={!isColliding} />
                </mesh>
            )}
        </group>
    );
};