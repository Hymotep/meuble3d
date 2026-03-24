import React, { useState, useRef, useMemo } from "react";
// NOUVEAU : On importe `Html` pour afficher le texte des mesures
import { useGLTF, useTexture, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
    CAISSON_CONSTANTS,
    getNbTiroirs,
    hasDrawers,
    calculateScales,
    calculateDrawerScales,
    calculateDoorScale,
    createMaterial,
    getZOffsetAndScale,
} from "../utils/index.js";
import { renderPortes, doorAnimation } from "../utils/porteUtils.jsx";
import { renderEtagere, renderPenderie, renderTiroirs, drawerAnimation } from "../utils/tiroirsUtils.jsx";

// ============================================================================
// --- NOUVEAU COMPOSANT : LES COTES 3D (MESURES) ---
// ============================================================================
const DimensionLine = ({ length, position, rotation, label }) => {
    const color = "#001d32"; // Orange "Plan d'architecte"
    
    return (
        <group position={position} rotation={rotation}>
            {/* Ligne principale (au centre) */}
            <mesh renderOrder={999}>
                <cylinderGeometry args={[4, 4, length, 8]} />
                {/* depthTest={false} permet à la ligne de s'afficher PAR-DESSUS le meuble, sans être cachée */}
                <meshBasicMaterial color={color} depthTest={false} transparent opacity={0.8} />
            </mesh>
            
            {/* Taquet (limite) gauche/haut */}
            <mesh position={[0, length / 2, 0]} rotation={[0, 0, Math.PI / 2]} renderOrder={999}>
                <cylinderGeometry args={[6, 6, 60, 8]} />
                <meshBasicMaterial color={color} depthTest={false} />
            </mesh>
            
            {/* Taquet (limite) droite/bas */}
            <mesh position={[0, -length / 2, 0]} rotation={[0, 0, Math.PI / 2]} renderOrder={999}>
                <cylinderGeometry args={[6, 6, 60, 8]} />
                <meshBasicMaterial color={color} depthTest={false} />
            </mesh>
            
            {/* Étiquette de texte (HTML pur superposé à la 3D) */}
            <Html center style={{ pointerEvents: "none", zIndex: 1000 }}>
                <div style={{
                    background: color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {label} cm
                </div>
            </Html>
        </group>
    );
};

export function Caisson({
    largeur,
    hauteur,
    profondeur,
    doorsCount,
    activeConfig,
    isSelected,
    onClick,
    finitionExt,
    couleurExt,
    finitionInt,
    couleurInt,
    avecPoignees,
    couleurPoignees,
    avecLED, 
    isTiroirsInterieurs,
    isRightHinge,
    ...props
}) {
    const { nodes } = useGLTF("/models/caisson.glb");

    const [colorMap, normalMap, roughnessMap] = useTexture([
        "/textures/oak/chene_color.jpg",
        "/textures/oak/chene_normal.jpg",
        "/textures/oak/chene_roughness.jpg",
    ]);

    colorMap.colorSpace = THREE.SRGBColorSpace;

    const [isHovered, setIsHovered] = useState(false);
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();
    const drawerRef = useRef();

    const { BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH, EPAISSEUR } = CAISSON_CONSTANTS;

    const matExt = useMemo(() => {
        return createMaterial(finitionExt, couleurExt, colorMap, normalMap, roughnessMap);
    }, [finitionExt, couleurExt, colorMap, normalMap, roughnessMap]);

    const matInt = useMemo(() => {
        return createMaterial(finitionInt, couleurInt, colorMap, normalMap, roughnessMap);
    }, [finitionInt, couleurInt, colorMap, normalMap, roughnessMap]);

    const { scaleX_horizontales, scaleX_etagere, scaleZ_verticales, scaleZ_fond, scaleY_profondeur, deltaX, deltaY } = calculateScales(
        largeur,
        hauteur,
        profondeur,
    );

    let nbTiroirs = getNbTiroirs(activeConfig);

    const hasDrawersConfig = hasDrawers(activeConfig);

    const { scaleX_tiroir_face, scaleX_tiroir_fond, scaleY_tiroir_prof, scaleZ_tiroir, HAUTEUR_BLOC_TIROIR } = calculateDrawerScales(
        largeur,
        profondeur,
        nbTiroirs,
    );

    const { scaleZ_demi_porte } = calculateDoorScale(hauteur);

    useFrame(() => {
        doorAnimation(leftDoorRef, rightDoorRef, isHovered, hasDrawersConfig);
        drawerAnimation(drawerRef, isHovered, isTiroirsInterieurs, hasDrawersConfig);
    });

    const renderEtagereFn = (hauteurZ, key) => renderEtagere(nodes, matInt, EPAISSEUR, scaleX_etagere, scaleY_profondeur, hauteurZ, key, avecLED, largeur, profondeur);
    const renderPenderieFn = (hauteurEtagere, key) => renderPenderie(largeur, EPAISSEUR, profondeur, hauteurEtagere, key);
    const renderTiroirsFn = () =>
        renderTiroirs(
            nodes, matInt, matExt, nbTiroirs, isTiroirsInterieurs,
            scaleX_tiroir_face, scaleX_tiroir_fond, scaleY_tiroir_prof, scaleZ_tiroir,
            deltaX, deltaY, drawerRef,
        );

    const renderPortesFn = (zOffsetPorte, scaleZPorte) =>
        renderPortes(
            nodes, matExt, largeur, scaleZPorte, EPAISSEUR, scaleX_horizontales,
            avecPoignees, couleurPoignees, isRightHinge, leftDoorRef, rightDoorRef,
            zOffsetPorte, doorsCount,
        );

    const { zOffset: zOffsetPorte, scaleZ: scaleZPorte } = getZOffsetAndScale(
        hasDrawersConfig, isTiroirsInterieurs, scaleZ_fond, scaleZ_demi_porte, HAUTEUR_BLOC_TIROIR,
    );

    return (
        <group
            {...props}
            dispose={null}
            onClick={onClick}
            onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
        >
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <group scale={0.001}>
                    <mesh geometry={nodes.Geom3D_traversse_bas.geometry} material={matExt} scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]} />
                    <mesh geometry={nodes.Geom3D_montant_droit.geometry} material={matExt} position={[0, 0, EPAISSEUR]} scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]} />
                    <mesh geometry={nodes.Geom3D_montant_gauche.geometry} material={matExt} position={[largeur - EPAISSEUR, 0, EPAISSEUR]} scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]} />
                    <mesh geometry={nodes.Geom3D_traverse_haut.geometry} material={matExt} position={[0, 0, hauteur - EPAISSEUR]} scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]} />
                    <mesh geometry={nodes.Geom3D_fond_arrière.geometry} material={matInt} position={[0, profondeur, 0]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]} />

                    {avecLED && (
                        <group position={[largeur / 2, profondeur - 50, hauteur - EPAISSEUR - 10]}>
                            <mesh>
                                <boxGeometry args={[largeur - EPAISSEUR * 2 - 20, 8, 4]} />
                                <meshBasicMaterial color="#fffbeb" />
                            </mesh>
                            <pointLight distance={hauteur * 1.5} intensity={0.5} color="#fffbeb" position={[0, -20, 0]} decay={2} />
                        </group>
                    )}

                    {activeConfig === 0 && renderEtagereFn(hauteur / 2, "etagere-centre")}

                    {[1, 6, 7].includes(activeConfig) && (
                        <group>
                            {renderTiroirsFn()}
                            {renderEtagereFn(hauteur - 300, "etagere-haute")}
                            {renderPenderieFn(hauteur - 300, "penderie-1")}
                        </group>
                    )}

                    {activeConfig === 2 && <group> {[1, 2, 3, 4].map((i) => renderEtagereFn((hauteur / 5) * i, `etagere-biblio-${i}`))} </group>}

                    {activeConfig === 3 && (
                        <group>
                            {renderEtagereFn(hauteur - 300, "etagere-cachee")}
                            {renderPenderieFn(hauteur - 300, "penderie-cachee")}
                        </group>
                    )}

                    {[4, 8].includes(activeConfig) && renderTiroirsFn()}

                    {activeConfig === 5 && (
                        <group>
                            {renderEtagereFn(hauteur - 300, "etagere-penderie")}
                            {renderPenderieFn(hauteur - 300, "barre-penderie-simple")}
                        </group>
                    )}

                    {renderPortesFn(zOffsetPorte, scaleZPorte)}

                    {/* === SÉLECTION & MESURES DU CAISSON === */}
                    {isSelected && (
                        <>
                            {/* Le contour de sélection léger (passé en orange) */}
                            <mesh position={[largeur / 2, profondeur / 2, hauteur / 2]}>
                                <boxGeometry args={[largeur + 4, profondeur + 4, hauteur + 4]} />
                                <meshBasicMaterial color="#f97316" transparent opacity={0.15} depthWrite={false} />
                            </mesh>

                            {/* LES MESURES (Largeur, Hauteur, Profondeur) */}
                            
                            {/* 1. Largeur (X) - Devant, en bas */}
                            <DimensionLine 
                                length={largeur} 
                                position={[largeur / 2, -150, 50]} 
                                rotation={[0, 0, Math.PI / 2]} 
                                label={(largeur / 10).toFixed(0)} 
                            />
                            
                            {/* 2. Hauteur (Z) - À droite, en bas */}
                            <DimensionLine 
                                length={hauteur} 
                                position={[largeur + 150, -50, hauteur / 2]} 
                                rotation={[Math.PI / 2, 0, 0]} 
                                label={(hauteur / 10).toFixed(0)} 
                            />
                            
                            {/* 3. Profondeur (Y) - À gauche, au sol */}
                            <DimensionLine 
                                length={profondeur} 
                                position={[-150, profondeur / 2, 50]} 
                                rotation={[0, 0, 0]} 
                                label={(profondeur / 10).toFixed(0)} 
                            />
                        </>
                    )}
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/models/caisson.glb");