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
export * from "./caissonCalculations.js";

// Export du calcul de prix
export * from "./priceCalculation.js";

// Export des presets
export * from "./presets.js";

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
} from "./caissonUtils.js";

// Re-export des fonctions de rendu (portes et tiroirs)
export * from "./porteUtils.jsx";
export * from "./tiroirsUtils.jsx";
