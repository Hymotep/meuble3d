import * as THREE from "three";

export const CAISSON_CONSTANTS = {
  BASE_WIDTH: 600,
  BASE_HEIGHT: 812,
  BASE_DEPTH: 600,
  EPAISSEUR: 18,
  HAUTEUR_BLOC_TIROIR: 300,
  HAUTEUR_TIROIR_ORIGINE: 200,
  HAUTEUR_PORTE_ORIGINE: 812 - 18,
};

export const CONFIG_DRAWERS = [1, 4, 6, 7, 8];

export const getNbTiroirs = (activeConfig) => {
  let nbTiroirs = 2;
  if (activeConfig === 6 || activeConfig === 8) nbTiroirs = 3;
  if (activeConfig === 7) nbTiroirs = 4;
  return nbTiroirs;
};

export const hasDrawers = (activeConfig) => CONFIG_DRAWERS.includes(activeConfig);

export const calculateScales = (largeur, hauteur, profondeur) => {
  const { BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH, EPAISSEUR } = CAISSON_CONSTANTS;
  
  const scaleX_horizontales = largeur / BASE_WIDTH;
  const scaleX_etagere = (largeur - EPAISSEUR * 2) / (BASE_WIDTH - EPAISSEUR * 2);
  const scaleZ_verticales = (hauteur - EPAISSEUR * 2) / (BASE_HEIGHT - EPAISSEUR * 2);
  const scaleZ_fond = hauteur / BASE_HEIGHT;
  const scaleY_profondeur = profondeur / BASE_DEPTH;
  
  const deltaY = profondeur - BASE_DEPTH;
  const deltaX = largeur - BASE_WIDTH;
  
  return {
    scaleX_horizontales,
    scaleX_etagere,
    scaleZ_verticales,
    scaleZ_fond,
    scaleY_profondeur,
    deltaX,
    deltaY,
  };
};

export const calculateDrawerScales = (largeur, profondeur, nbTiroirs = 2) => {
  const { BASE_WIDTH, BASE_DEPTH, HAUTEUR_BLOC_TIROIR, HAUTEUR_TIROIR_ORIGINE } = CAISSON_CONSTANTS;
  
  const deltaX = largeur - BASE_WIDTH;
  const deltaY = profondeur - BASE_DEPTH;
  
  const scaleX_tiroir_face = (554 + deltaX) / 554;
  const scaleX_tiroir_fond = (518 + deltaX) / 518;
  const scaleY_tiroir_prof = (569.67 + deltaY) / 569.67;
  
  const hauteurUnTiroir = HAUTEUR_BLOC_TIROIR / nbTiroirs;
  const scaleZ_tiroir = hauteurUnTiroir / HAUTEUR_TIROIR_ORIGINE;
  
  return {
    scaleX_tiroir_face,
    scaleX_tiroir_fond,
    scaleY_tiroir_prof,
    scaleZ_tiroir,
    HAUTEUR_BLOC_TIROIR,
  };
};

export const calculateDoorScale = (hauteur) => {
  const { HAUTEUR_BLOC_TIROIR, HAUTEUR_PORTE_ORIGINE } = CAISSON_CONSTANTS;
  const espaceLibrePourPorte = hauteur - HAUTEUR_BLOC_TIROIR - CAISSON_CONSTANTS.EPAISSEUR;
  const scaleZ_demi_porte = espaceLibrePourPorte / HAUTEUR_PORTE_ORIGINE;
  
  return { scaleZ_demi_porte, HAUTEUR_PORTE_ORIGINE };
};

export const createMaterial = (finition, couleur, colorMap, normalMap, roughnessMap) => {
  const isOak = finition === "Chêne";
  return new THREE.MeshStandardMaterial({
    color: isOak ? "#ffffff" : couleur,
    map: isOak ? colorMap : null,
    normalMap: isOak ? normalMap : null,
    roughnessMap: isOak ? roughnessMap : null,
    roughness: isOak ? 1 : 0.8,
    side: THREE.DoubleSide,
  });
};

export const setupTextures = (setTexture, paths) => {
  const [colorMap, normalMap, roughnessMap] = setTexture(paths);
  
  if (colorMap) {
    colorMap.colorSpace = THREE.SRGBColorSpace;
  }
  
  return [colorMap, normalMap, roughnessMap];
};

export const getZOffsetAndScale = (hasDrawers, isTiroirsInterieurs, scaleZ_fond, scaleZ_demi_porte, HAUTEUR_BLOC_TIROIR) => {
  if (hasDrawers && !isTiroirsInterieurs) {
    return {
      zOffset: HAUTEUR_BLOC_TIROIR,
      scaleZ: scaleZ_demi_porte,
    };
  }
  return {
    zOffset: 0,
    scaleZ: scaleZ_fond,
  };
};
