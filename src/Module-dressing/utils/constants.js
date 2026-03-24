/**
 * ============================================================================
 * CONSTANTS - Toutes les valeurs de configuration du configurateur dressing
 * ============================================================================
 * Ce fichier centralise toutes les constantes pour faciliter la maintenance
 * et les ajustements futurs sans modifier la logique métier.
 */

/**
 * Constantes physiques du caisson (en mm)
 * BASE_* correspondent aux dimensions du modèle 3D source
 */
export const CAISSON_CONSTANTS = {
  BASE_WIDTH: 600,
  BASE_HEIGHT: 812,
  BASE_DEPTH: 600,
  EPAISSEUR: 18,
  HAUTEUR_BLOC_TIROIR: 300,
  HAUTEUR_TIROIR_ORIGINE: 200,
  HAUTEUR_PORTE_ORIGINE: 812 - 18,
};

/**
 * Configuration de la découpe des portes
 * GAP: espace entre les caissons (mm)
 * MAX_DOOR_WIDTH: largeur maximale d'une porte avant de la diviser (mm)
 */
export const DOOR_CONFIG = {
  GAP: 2,
  MAX_DOOR_WIDTH: 500,
};

/**
 * Liste des configurations qui utilisent des tiroirs
 * 1, 4: Dressing (2 tiroirs)
 * 6, 8: Dressing (3 tiroirs)
 * 7: Dressing (4 tiroirs)
 */
export const CONFIG_WITH_DRAWERS = [1, 4, 6, 7, 8];

/**
 * Labels des configurations d'agencement
 * Correspond aux différentes options dans le dropdown de sélection
 */
export const CONFIG_LABELS = {
  0: "Vide (1 Étagère)",
  1: "Dressing (2 Tiroirs + Penderie)",
  2: "Bibliothèque (4 Étagères)",
  3: "Fermé (Porte totale)",
  4: "Mixte (Porte haute + 2 Tiroirs)",
  5: "Penderie (Barre + Étagère)",
  6: "Dressing (3 Tiroirs + Penderie)",
  7: "Dressing (4 Tiroirs + Penderie)",
  8: "Mixte (Porte haute + 3 Tiroirs)",
};

/**
 * Paramètres de la caméra 3D
 */
export const CAMERA_CONFIG = {
  POSITION: [0, 1.5, 5],
  FOV: 45,
  MIN_POLAR_ANGLE: Math.PI / 8,
  MAX_POLAR_ANGLE: Math.PI / 2 - 0.05,
  MIN_AZIMUTH_ANGLE: -Math.PI / 4,
  MAX_AZIMUTH_ANGLE: Math.PI / 4,
};

/**
 * Limites des dimensions (en cm)
 */
export const DIMENSION_LIMITS = {
  LARGEUR: { MIN: 40, MAX: 600 },
  PROFONDEUR: { MIN: 30, MAX: 100 },
  HAUTEUR: { MIN: 60, MAX: 300 },
};

/**
 * Chemins des textures (chêne)
 */
export const TEXTURE_PATHS = {
  OAK: {
    COLOR: "/textures/oak/chene_color.jpg",
    NORMAL: "/textures/oak/chene_normal.jpg",
    ROUGHNESS: "/textures/oak/chene_roughness.jpg",
  },
};

/**
 * Chemins des modèles 3D
 */
export const MODEL_PATHS = {
  CAISSON: "/models/caisson.glb",
};

/**
 * Couleurs par défaut de l'interface
 */
export const DEFAULT_COLORS = {
  EXTERIOR: "#e2b388",
  INTERIOR: "#ffffff",
  MUR: "#f1f5f9",
  SOL: "#e5e7eb",
  POIGNEES: "#222222",
};

/**
 * Valeurs par défaut
 */
export const DEFAULTS = {
  LARGEUR: 120,
  PROFONDEUR: 60,
  FINITION_EXT: "Chêne",
  FINITION_INT: "Couleur",
  AVEC_POIGNEES: true,
  AVEC_LED: false,
};
