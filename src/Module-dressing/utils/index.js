/**
 * ============================================================================
 * INDEX - Point d'export des utilitaires du module dressing
 * ============================================================================
 * Ce fichier centralise les exports de tous les utilitaires pour faciliter
 * les imports dans les composants.
 */

// Export des constantes
export * from "./constants.js";

// Export des calculs de caissons
export * from "./Caisson/caissonCalculations.js";

// Export du calcul de prix
export * from "./Quote/priceCalculation.js";

// Export des presets
export * from "./Presets/presets.js";

// Export des utilitaires existants (pour compatibilité avec Caisson.jsx)
export {
  CAISSON_CONSTANTS,
  CONFIG_DRAWERS,
  getNbTiroirs,
  hasDrawers,
  calculateScales,
  calculateDrawerScales,
  calculateDoorScale,
  createMaterial,
  setupTextures,
  getZOffsetAndScale,
} from "./Caisson/caissonUtils.js";

// Re-export des fonctions de rendu (portes et tiroirs)
export * from "./Caisson/porteUtils.jsx";
export * from "./Caisson/tiroirsUtils.jsx";
