/**
 * ============================================================================
 * CAISSON CALCULATIONS - Logique de calcul pour les caissons
 * ============================================================================
 * Ce fichier contient toutes les fonctions de calcul relatives à la création
 * et au dimensionnement des caissons : découpe, échelles, positions.
 * 
 * Utilisé par DressingConfigurator pour générer la disposition des caissons.
 */

import { CAISSON_CONSTANTS, DOOR_CONFIG, CONFIG_WITH_DRAWERS } from "../constants.js";

/**
 * Calcule le nombre de portes et la répartition des caissons
 * en fonction de la largeur totale du dressing.
 * 
 * @param {number} largeurTotaleCM - Largeur totale en centimètres
 * @returns {Object} - { nbPortes, nbCaissonsDoubles, nbCaissonsSimples }
 */
export const calculateDoorCount = (largeurTotaleCM) => {
  const { GAP, MAX_DOOR_WIDTH } = DOOR_CONFIG;
  const largeurTotaleMM = largeurTotaleCM * 10;

  const nbPortes = Math.ceil(largeurTotaleMM / MAX_DOOR_WIDTH);
  const nbCaissonsDoubles = Math.floor(nbPortes / 2);
  const nbCaissonsSimples = nbPortes % 2;

  return { nbPortes, nbCaissonsDoubles, nbCaissonsSimples };
};

/**
 * Calcule les dimensions finales de chaque caisson après distribution
 * de la largeur totale (avec espaces/GAPs).
 * 
 * @param {number} largeurTotaleCM - Largeur totale en centimètres
 * @returns {Array} - Tableau d'objets { width, doorsCount }
 */
export const calculateCaissonDimensions = (largeurTotaleCM) => {
  const { GAP, MAX_DOOR_WIDTH } = DOOR_CONFIG;
  const { nbCaissonsDoubles, nbCaissonsSimples } = calculateDoorCount(largeurTotaleCM);

  const largeurTotaleMM = largeurTotaleCM * 10;

  const totalGaps = Math.max(0, nbCaissonsDoubles + nbCaissonsSimples - 1) * GAP;
  const largeurUtile = largeurTotaleMM - totalGaps;
  const largeurUnitePorte = largeurUtile / (nbCaissonsDoubles * 2 + nbCaissonsSimples);

  const caissonsData = [];

  // Crée les caissons doubles (2 portes)
  for (let i = 0; i < nbCaissonsDoubles; i++) {
    caissonsData.push({ width: largeurUnitePorte * 2, doorsCount: 2 });
  }

  // Crée le caisson simple s'il reste une porte impaire
  if (nbCaissonsSimples > 0) {
    caissonsData.push({ width: largeurUnitePorte, doorsCount: 1 });
  }

  return caissonsData;
};

/**
 * Retourne le nombre de tiroirs pour une configuration donnée.
 * 
 * @param {number} activeConfig - ID de la configuration
 * @returns {number} - Nombre de tiroirs
 */
export const getNbTiroirs = (activeConfig) => {
  let nbTiroirs = 2;
  if (activeConfig === 6 || activeConfig === 8) nbTiroirs = 3;
  if (activeConfig === 7) nbTiroirs = 4;
  return nbTiroirs;
};

/**
 * Vérifie si une configuration utilise des tiroirs.
 * 
 * @param {number} activeConfig - ID de la configuration
 * @returns {boolean}
 */
export const hasDrawers = (activeConfig) => CONFIG_WITH_DRAWERS.includes(activeConfig);

/**
 * Calcule les échelles de transformation pour les éléments
 * horizontaux et verticaux du caisson (parois, fond, étagères).
 * 
 * @param {number} largeur - Largeur du caisson en mm
 * @param {number} hauteur - Hauteur du caisson en mm
 * @param {number} profondeur - Profondeur du caisson en mm
 * @returns {Object} - Toutes les échelles calculées
 */
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

/**
 * Calcule les échelles spécifiques aux tiroirs.
 * 
 * @param {number} largeur - Largeur du caisson en mm
 * @param {number} profondeur - Profondeur du caisson en mm
 * @param {number} nbTiroirs - Nombre de tiroirs
 * @returns {Object} - Échelles des tiroirs
 */
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

/**
 * Calcule l'échelle de la porte en hauteur.
 * 
 * @param {number} hauteur - Hauteur du caisson en mm
 * @returns {Object} - Échelle Z de la porte
 */
export const calculateDoorScale = (hauteur) => {
  const { HAUTEUR_BLOC_TIROIR, HAUTEUR_PORTE_ORIGINE, EPAISSEUR } = CAISSON_CONSTANTS;
  const espaceLibrePourPorte = hauteur - HAUTEUR_BLOC_TIROIR - EPAISSEUR;
  const scaleZ_demi_porte = espaceLibrePourPorte / HAUTEUR_PORTE_ORIGINE;

  return { scaleZ_demi_porte, HAUTEUR_PORTE_ORIGINE };
};

/**
 * Calcule le décalage Z et l'échelle des portes selon la configuration.
 * Utilisé pour positionner les portes au bon endroit (au-dessus des tiroirs ou non).
 * 
 * @param {boolean} hasDrawers - Si la config contient des tiroirs
 * @param {boolean} isTiroirsInterieurs - Si les tiroirs sont cachés à l'intérieur
 * @param {number} scaleZ_fond - Échelle du fond
 * @param {number} scaleZ_demi_porte - Échelle de la porte
 * @param {number} HAUTEUR_BLOC_TIROIR - Hauteur du bloc tiroir
 * @returns {Object} - { zOffset, scaleZ }
 */
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
