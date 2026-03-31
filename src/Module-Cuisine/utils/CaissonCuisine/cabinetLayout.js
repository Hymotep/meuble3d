/**
 * ============================================================================
 * CABINET LAYOUT ENGINE
 * ============================================================================
 * Fonction pure qui calcule toutes les dimensions de découpe d'un meuble.
 * Isole les mathématiques du rendu visuel.
 */

export const getCabinetLayout = (largeur, hauteur, profondeur, type, equipement) => {
    // Conversion en mètres
    const w = largeur / 1000;
    const h = hauteur / 1000;
    const d = profondeur / 1000;

    const doorThickness = 0.02;
    const gap = 0.004;

    // Flags de type
    const isBase = type === "base_cabinet";
    const isTall = type === "tall_cabinet";
    const isIsland = type === "island";
    const isDishwasher = equipement === "dishwasher_45" || equipement === "dishwasher_60";

    // Calculs structurels communs
    const plintheH = isBase || isTall || isIsland ? 0.15 : 0;
    const planH = isBase || isIsland ? 0.038 : 0;
    const corpsH = h - plintheH - planH;
    const bottomY = -h / 2;

    // Constantes pour l'Îlot
    const bodyD = d * 0.65;
    const bodyZ = d / 2 - bodyD / 2;
    const nbCols = w > 1.5 ? 3 : 2;
    const colW = (w - gap * (nbCols + 1)) / nbCols;
    const startX = -w / 2 + colW / 2 + gap;

    // Constantes pour les Meubles Colonnes / Tiroirs
    const t1H = corpsH * 0.2;
    const t2H = corpsH * 0.4;
    const t3H = corpsH * 0.4;

    const bottomDoorH = 0.7;
    const ovenH = 0.6;
    const mwH = 0.38;
    const topDoorH = corpsH - bottomDoorH - ovenH - mwH;
    const doorZ = d / 2 - doorThickness / 2 + 0.002;

    return {
        // Dimensions de base
        w, h, d, doorThickness, gap,
        // Flags
        isBase, isTall, isIsland, isDishwasher,
        // Segmentation verticale
        plintheH, planH, corpsH, bottomY,
        // Données Îlot
        island: { bodyD, bodyZ, nbCols, colW, startX },
        // Données Façades / Colonnes
        tall: { t1H, t2H, t3H, bottomDoorH, ovenH, mwH, topDoorH, doorZ }
    };
};