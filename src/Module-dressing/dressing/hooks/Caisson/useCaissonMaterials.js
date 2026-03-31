/**
 * ============================================================================
 * USE CAISSON MATERIALS HOOK
 * ============================================================================
 * Gère le chargement des textures PBR et la création des matériaux (intérieur
 * et extérieur) pour le caisson de dressing.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { createMaterial } from ".././.././././../utils/index"; 

export const useCaissonMaterials = (finitionExt, couleurExt, finitionInt, couleurInt) => {
    // Chargement des textures
    const [colorMap, normalMap, roughnessMap] = useTexture([
        "/textures/oak/chene_color.jpg",
        "/textures/oak/chene_normal.jpg",
        "/textures/oak/chene_roughness.jpg",
    ]);

    // Correction de l'espace colorimétrique
    colorMap.colorSpace = THREE.SRGBColorSpace;

    // Création du matériau Extérieur (Façades)
    const matExt = useMemo(() => {
        return createMaterial(finitionExt, couleurExt, colorMap, normalMap, roughnessMap);
    }, [finitionExt, couleurExt, colorMap, normalMap, roughnessMap]);

    // Création du matériau Intérieur (Caisson)
    const matInt = useMemo(() => {
        return createMaterial(finitionInt, couleurInt, colorMap, normalMap, roughnessMap);
    }, [finitionInt, couleurInt, colorMap, normalMap, roughnessMap]);

    return { matExt, matInt };
};