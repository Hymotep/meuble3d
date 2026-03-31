/**
 * ============================================================================
 * PRESETS - Configurations prédéfinies du dressing
 * ============================================================================
 * Ce fichier contient les "inspirations" : des configurations complètes
 * prédéfinies que l'utilisateur peut charger en un clic.
 * 
 * Chaque preset définit :
 * - Les dimensions globales (largeur, profondeur)
 * - Les finitions (type et couleur)
 * - Les options (LED, poignées)
 * - La configuration de chaque caisson
 * - Les couleurs de la pièce (mur, sol)
 */

/**
 * Prédéfinition "Suite Parentale"
 * Grand dressing complet avec penderies et tiroirs, fini en chêne,
 * avec éclairage LED - configuration premium.
 */
export const PRESET_SUITE = {
  label: "Suite Parentale",
  dimensions: {
    largeur: 300,
    profondeur: 60,
  },
  finish: {
    exterior: "Chêne",
    interior: "Couleur",
    couleurInt: "#1e293b",
  },
  options: {
    avecPoignees: true,
    avecLED: true,
  },
  configs: { 0: 5, 1: 7, 2: 5 },
  hauteurs: { 0: 240, 1: 240, 2: 240 },
  room: {
    mur: "#1e293b",
    sol: "#3f3f46",
  },
};

/**
 * Prédéfinition "Meuble Entrée"
 * Configuration compacte et fonctionnelle pour une entrée,
 * sans LED, couleur claire.
 */
export const PRESET_ENTREE = {
  label: "Meuble Entrée",
  dimensions: {
    largeur: 120,
    profondeur: 45,
  },
  finish: {
    exterior: "Couleur",
    couleurExt: "#cbd5e1",
    interior: "Chêne",
  },
  options: {
    avecPoignees: true,
    avecLED: false,
  },
  configs: { 0: 5, 1: 4 },
  hauteurs: { 0: 200, 1: 200 },
  room: {
    mur: "#ffffff",
    sol: "#d1d5db",
  },
};

/**
 * Prédéfinition "Bibliothèque"
 * Grande bibliothèque ouverte sans portes,
 * avec étagères et éclairage LED.
 */
export const PRESET_BIBLIO = {
  label: "Bibliothèque",
  dimensions: {
    largeur: 240,
    profondeur: 35,
  },
  finish: {
    exterior: "Chêne",
    interior: "Chêne",
  },
  options: {
    avecPoignees: false,
    avecLED: true,
  },
  configs: { 0: 2, 1: 2, 2: 2, 3: 2, 4: 2 },
  hauteurs: { 0: 220, 1: 220, 2: 220, 3: 220, 4: 220 },
  room: {
    mur: "#f1f5f9",
    sol: "#fef3c7",
  },
};

/**
 * Liste de tous les presets disponibles
 */
export const PRESETS = [PRESET_SUITE, PRESET_ENTREE, PRESET_BIBLIO];

/**
 * Récupère un preset par son ID
 * @param {string} type - Identifiant du preset ("suite", "entree", "biblio")
 * @returns {Object|null} - Le preset ou null si non trouvé
 */
export const getPresetByType = (type) => {
  switch (type) {
    case "suite":
      return PRESET_SUITE;
    case "entree":
      return PRESET_ENTREE;
    case "biblio":
      return PRESET_BIBLIO;
    default:
      return null;
  }
};
