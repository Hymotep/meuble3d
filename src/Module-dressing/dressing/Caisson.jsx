import React, { useState, useRef, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
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
    avecLED, // <--- NOUVEAU
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

    // ON TRANSMET `avecLED`, `largeur` ET `profondeur` POUR DESSINER LA LUMIÈRE
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

                    {/* NOUVEAU : RUBAN LED GLOBAL AU PLAFOND DU CAISSON */}
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

                    {isSelected && (
                        <mesh position={[largeur / 2, profondeur / 2, hauteur / 2]}>
                            <boxGeometry args={[largeur + 4, profondeur + 4, hauteur + 4]} />
                            <meshBasicMaterial color="#ff4a36" transparent opacity={0.3} depthWrite={false} />
                        </mesh>
                    )}
                </group>
            </group>
        </group>
    );
}

useGLTF.preload("/models/caisson.glb");