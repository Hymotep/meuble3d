/**
 * ============================================================================
 * USE CABINET MATERIALS HOOK
 * ============================================================================
 * Gère le chargement des textures PBR et la création des matériaux Three.js
 * pour les caissons, plans de travail et poignées.
 */

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export const useCabinetMaterials = ({ useTextures, couleurExt, couleurPlanTravail, couleurPoignees }) => {
    // Chargement des textures PBR
    const textures = useTexture({
        woodMap: "public/textures/oak/chene_color.jpg",
        woodRough: "public/textures/oak/chene_roughness.jpg",
        woodNormal: "public/textures/oak/chene_normal.jpg",
        marbleMap: "public/textures/oak/chene_color.jpg",
        marbleRough: "public/textures/oak/chene_color.jpg",
        metalNormal: "public/textures/oak/chene_color.jpg",
    });

    // Configuration de la répétition des textures
    useEffect(() => {
        if (textures.woodMap) {
            textures.woodMap.wrapS = textures.woodMap.wrapT = THREE.RepeatWrapping;
            textures.woodMap.repeat.set(1, 2);
            textures.woodNormal.wrapS = textures.woodNormal.wrapT = THREE.RepeatWrapping;
            textures.woodNormal.repeat.set(1, 2);
        }
    }, [textures]);

    // Matériau de la façade (Portes/Tiroirs)
    const facadeMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: useTextures ? "#ffffff" : couleurExt,
                map: useTextures ? textures.woodMap : null,
                roughnessMap: useTextures ? textures.woodRough : null,
                normalMap: useTextures ? textures.woodNormal : null,
                normalScale: useTextures ? new THREE.Vector2(0.5, 0.5) : new THREE.Vector2(0, 0),
                roughness: useTextures ? 0.7 : 0.4,
                metalness: 0.05,
            }),
        [textures, useTextures, couleurExt]
    );

    // Matériau du plan de travail
    const worktopMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: useTextures ? "#ffffff" : couleurPlanTravail,
                map: useTextures ? textures.marbleMap : null,
                roughnessMap: useTextures ? textures.marbleRough : null,
                roughness: useTextures ? 0.1 : 0.4,
                metalness: 0.0,
                envMapIntensity: useTextures ? 1.5 : 1.0,
            }),
        [textures, useTextures, couleurPlanTravail]
    );

    // Matériau des poignées
    const handleMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: useTextures ? "#d1d5db" : couleurPoignees,
                normalMap: useTextures ? textures.metalNormal : null,
                normalScale: useTextures ? new THREE.Vector2(1.5, 1.5) : new THREE.Vector2(0, 0),
                roughness: useTextures ? 0.3 : 0.2,
                metalness: useTextures ? 1.0 : 0.8,
            }),
        [textures, useTextures, couleurPoignees]
    );

    return { facadeMaterial, worktopMaterial, handleMaterial };
};