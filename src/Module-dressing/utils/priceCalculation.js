/**
 * ============================================================================
 * PRICE CALCULATION - Logique de calcul du prix en temps réel
 * ============================================================================
 * Ce fichier contient l'algorithme de tarification du dressing.
 * Le prix est calculé en fonction de multiples facteurs :
 * - Volume du caisson (dimensions)
 * - Finitions (bois vs couleur)
 * - Configuration intérieure (tiroirs, étagères, penderies)
 * - Accessoires (LED, poignées)
 * * @usage: Utilisé par useMemo dans DressingConfigurator pour une
 * mise à jour automatique du prix lors de chaque modification.
 */

import { getNbTiroirs, hasDrawers } from "./caissonCalculations.js";

/**
 * Tarifs de base (en euros)
 */
const PRICES = {
  CAISSON_BASE: 50,
  CAISSON_VOLUME_RATE: 2.5,
  PORTE_BASE: 35,
  TIROIR: 55,
  ETAGERE_BIBLIO: 15,
  PENDERIE_SIMPLE: 25,
  PENDERIE_AVEC_SEPARATION: 30,
  LED_PAR_CAISON: 45,
  POIGNEE_PAR_PORTE: 12,
};

/**
 * Multiplicateurs de prix selon les finitions
 */
const FINITION_MULTIPLIERS = {
  CHENE: 1.3,
  COULEUR: 1.0,
};

/**
 * Calcule le prix d'un caisson individuel.
 * * @param {Object} params - Paramètres du caisson
 * @param {number} params.widthCM - Largeur en cm
 * @param {number} params.heightCM - Hauteur en cm
 * @param {number} params.depthCM - Profondeur en cm
 * @param {number} params.doors - Nombre de portes
 * @param {number} params.config - ID de configuration
 * @param {string} params.finitionExt - Finition extérieur ("Chêne" ou "Couleur")
 * @param {string} params.finitionInt - Finition intérieur
 * @param {boolean} params.avecLED - Si éclairage LED activé
 * @param {boolean} params.avecPoignees - Si poignées activées
 * @returns {number} - Prix du caisson en euros
 */
export const calculateCaissonPrice = ({
  widthCM,
  heightCM,
  depthCM,
  doors,
  config,
  finitionExt,
  finitionInt,
  avecLED,
  avecPoignees,
}) => {
  let price = PRICES.CAISSON_BASE;

  // 1. Structure du caisson (Volume)
  // Prix proportionnel au volume: (largeur * hauteur * profondeur) / 10000 * taux
  price += ((widthCM * heightCM * depthCM) / 10000) * PRICES.CAISSON_VOLUME_RATE;

  // Majoration chêne pour l'intérieur
  if (finitionInt === "Chêne") {
    price *= FINITION_MULTIPLIERS.CHENE;
  }

  // 2. Portes (Façades)
  let doorsPrice = doors * PRICES.PORTE_BASE;
  if (finitionExt === "Chêne") {
    doorsPrice *= FINITION_MULTIPLIERS.CHENE;
  }
  price += doorsPrice;

  // 3. Aménagement Intérieur (Tiroirs & Étagères)
  const nbTiroirs = getNbTiroirs(config);
  price += nbTiroirs * PRICES.TIROIR;

  // Bibliothèque (4 étagères)
  if (config === 2) {
    price += 4 * PRICES.ETAGERE_BIBLIO;
  }

  // Penderie simple
  if (config === 5) {
    price += PRICES.PENDERIE_SIMPLE;
  }

  // Penderie avec séparation (config 1, 6, 7)
  if ([1, 6, 7].includes(config)) {
    price += PRICES.PENDERIE_AVEC_SEPARATION;
  }

  // 4. Accessoires
  if (avecLED) {
    price += PRICES.LED_PAR_CAISON;
  }
  if (avecPoignees) {
    price += doors * PRICES.POIGNEE_PAR_PORTE;
  }

  return Math.round(price);
};

/**
 * Calcule le prix total du dressing complet.
 * * @param {Array} caissonsData - Données des caissons
 * @param {Object} hauteurs - Hauteurs par caisson { index: hauteurCM }
 * @param {Object} configs - Configurations par caisson { index: configId }
 * @param {number} profondeurCM - Profondeur commune
 * @param {string} finitionExt - Finition extérieur
 * @param {string} finitionInt - Finition intérieur
 * @param {boolean} avecLED - Si LED activé
 * @param {boolean} avecPoignees - Si poignées activées
 * @returns {number} - Prix totalTTC
 */
export const calculateTotalPrice = (
  caissonsData,
  hauteurs,
  configs,
  profondeurCM,
  finitionExt,
  finitionInt,
  avecLED,
  avecPoignees
) => {
  let total = 0;

  for (let i = 0; i < caissonsData.length; i++) {
    const widthCM = caissonsData[i].width / 10;
    const heightCM = hauteurs[i] || 200;
    const depthCM = profondeurCM;
    const doors = caissonsData[i].doorsCount;
    const config = configs[i] !== undefined ? configs[i] : 4;

    total += calculateCaissonPrice({
      widthCM,
      heightCM,
      depthCM,
      doors,
      config,
      finitionExt,
      finitionInt, // CORRECTION : j'ai retiré le "s" !
      avecLED,
      avecPoignees,
    });
  }

  return total;
};