/**
 * ============================================================================
 * DRESSING CONFIGURATOR - Composant principal
 * ============================================================================
 * Ce fichier est le point d'entrée du configurateur de dressing.
 * Il orchestre l'ensemble des composants et gère l'état global de l'application.
 * 
 * Structure :
 * - Import des composants enfants et utilitaires
 * - État global (dimensions, finitions, configurations)
 * - Calculs (caissons, prix)
 * - Rendu (UI + 3D)
 * 
 * @author: Développement interne
 * @maintainer: Équipe Topart
 */

// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState, useEffect, useRef, useMemo } from "react";

// Composants UI
import Sidebar from "./components/Sidebar.jsx";
import QuoteBox from "./components/QuoteBox.jsx";
import BottomBar from "./components/BottomBar.jsx";
import Scene from "./components/Scene.jsx";
import Room from "./components/Room.jsx";

// Composant 3D du caisson
import { Caisson } from "./Caisson.jsx";

// Utilitaires de calcul
import { calculateCaissonDimensions } from "../utils/caissonCalculations.js";
import { calculateTotalPrice } from "../utils/priceCalculation.js";

// Constantes
import { DEFAULTS, DIMENSION_LIMITS, DOOR_CONFIG } from "../utils/constants.js";

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function DressingConfigurator() {
  // ---------------------------------------------------------------------------
  // ÉTAT GLOBAL - Paramètres globaux du dressing
  // ---------------------------------------------------------------------------

  // ID du caisson actuellement sélectionné
  const [selectedId, setSelectedId] = useState(null);

  // Configurations individuelles des caissons (par index)
  const [configs, setConfigs] = useState({});
  const [hauteurs, setHauteurs] = useState({});
  const [tiroirsInt, setTiroirsInt] = useState({});

  // Dimensions globales
  const [largeurTotaleCM, setLargeurTotaleCM] = useState(DEFAULTS.LARGEUR);
  const [profondeurCM, setProfondeurCM] = useState(DEFAULTS.PROFONDEUR);

  // Finitions
  const [finitionExt, setFinitionExt] = useState(DEFAULTS.FINITION_EXT);
  const [couleurExt, setCouleurExt] = useState("#e2b388");
  const [finitionInt, setFinitionInt] = useState(DEFAULTS.FINITION_INT);
  const [couleurInt, setCouleurInt] = useState("#ffffff");

  // Accessoires
  const [avecPoignees, setAvecPoignees] = useState(DEFAULTS.AVEC_POIGNEES);
  const [couleurPoignees, setCouleurPoignees] = useState("#222222");
  const [avecLED, setAvecLED] = useState(DEFAULTS.AVEC_LED);

  // Pièce (mur et sol)
  const [couleurMur, setCouleurMur] = useState("#f1f5f9");
  const [couleurSol, setCouleurSol] = useState("#e5e7eb");

  // Référence pour les contrôles de caméra
  const orbitRef = useRef(null);

  // Profondeur en mm (pour le rendu 3D)
  const profondeur = profondeurCM * 10;

  // ---------------------------------------------------------------------------
  // CALCULS - Dimensions des caissons
  // ---------------------------------------------------------------------------

  /**
   * Calcule la liste des caissons avec leurs dimensions
   * en fonction de la largeur totale
   */
  const caissonsData = useMemo(() => {
    return calculateCaissonDimensions(largeurTotaleCM);
  }, [largeurTotaleCM]);

  // ---------------------------------------------------------------------------
  // CALCULS - Prix en temps réel
  // ---------------------------------------------------------------------------

  /**
   * Calcule le prix total du dressing
   * useMemo assure que le calcul ne se fait que cuando les dépendances changent
   */
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(
      caissonsData,
      hauteurs,
      configs,
      profondeurCM,
      finitionExt,
      finitionInt,
      avecLED,
      avecPoignees
    );
  }, [caissonsData, hauteurs, configs, profondeurCM, finitionExt, finitionInt, avecLED, avecPoignees]);

  // ---------------------------------------------------------------------------
  // GESTION DES PRESETS
  // ---------------------------------------------------------------------------

  /**
   * Charge un preset prédéfini dans l'état
   * @param {Object} preset - Configuration prédéfinie
   */
  const loadPreset = (preset) => {
    // Dimensions
    setLargeurTotaleCM(preset.dimensions.largeur);
    setProfondeurCM(preset.dimensions.profondeur);

    // Finitions
    setFinitionExt(preset.finish.exterior);
    setFinitionInt(preset.finish.interior);
    if (preset.finish.couleurExt) setCouleurExt(preset.finish.couleurExt);
    if (preset.finish.couleurInt) setCouleurInt(preset.finish.couleurInt);

    // Options
    setAvecPoignees(preset.options.avecPoignees);
    setAvecLED(preset.options.avecLED);

    // Configurations des caissons
    setConfigs(preset.configs);
    setHauteurs(preset.hauteurs);

    // Pièce
    setCouleurMur(preset.room.mur);
    setCouleurSol(preset.room.sol);

    // Désélectionner
    setSelectedId(null);
  };

  // ---------------------------------------------------------------------------
  // RENDU DES CAISSONS
  // ---------------------------------------------------------------------------

  /**
   * Génère les composants Caisson pour la scène 3D
   * @returns {Array} - Liste de composants Caisson
   */
  const renderCaissons = () => {
    const caissonsGeneres = [];
    let currentPositionX = -((largeurTotaleCM * 10) / 2);

    // Itérer sur chaque caisson
    for (let i = 0; i < caissonsData.length; i++) {
      const currentConfig = configs[i] !== undefined ? configs[i] : 4;
      const currentHauteur = (hauteurs[i] || 200) * 10;
      const currentTiroirsInt = tiroirsInt[i] || false;
      const isRightHinge = i % 2 !== 0;

      caissonsGeneres.push(
        <Caisson
          key={i}
          position={[currentPositionX / 1000, 0, 0]}
          largeur={caissonsData[i].width}
          doorsCount={caissonsData[i].doorsCount}
          hauteur={currentHauteur}
          profondeur={profondeur}
          activeConfig={currentConfig}
          isSelected={selectedId === i}
          finitionExt={finitionExt}
          couleurExt={couleurExt}
          finitionInt={finitionInt}
          couleurInt={couleurInt}
          avecPoignees={avecPoignees}
          couleurPoignees={couleurPoignees}
          avecLED={avecLED}
          isTiroirsInterieurs={currentTiroirsInt}
          isRightHinge={isRightHinge}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(i);
          }}
        />,
      );

      // Décalage pour le prochain caisson (largeur + gap)
      currentPositionX += caissonsData[i].width + DOOR_CONFIG.GAP;
    }

    return caissonsGeneres;
  };

  // ---------------------------------------------------------------------------
  // RENDU FINAL
  // ---------------------------------------------------------------------------

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      {/* Sidebar (à gauche) */}
      <Sidebar
        largeurTotaleCM={largeurTotaleCM}
        setLargeurTotaleCM={setLargeurTotaleCM}
        profondeurCM={profondeurCM}
        setProfondeurCM={setProfondeurCM}
        finishExt={finitionExt}
        setFinishExt={setFinitionExt}
        couleurExt={couleurExt}
        setCouleurExt={setCouleurExt}
        finishInt={finitionInt}
        setFinishInt={setFinitionInt}
        couleurInt={couleurInt}
        setCouleurInt={setCouleurInt}
        avecPoignees={avecPoignees}
        setAvecPoignees={setAvecPoignees}
        couleurPoignees={couleurPoignees}
        setCouleurPoignees={setCouleurPoignees}
        avecLED={avecLED}
        setAvecLED={setAvecLED}
        couleurMur={couleurMur}
        setCouleurMur={setCouleurMur}
        couleurSol={couleurSol}
        setCouleurSol={setCouleurSol}
        onLoadPreset={loadPreset}
      />

      {/* Zone principale (3D + UI) */}
      <div style={{ flex: 1, position: "relative" }}>
        
        {/* Panier / Prix */}
        <QuoteBox totalPrice={totalPrice} />

        {/* Barre de configuration (si un caisson est sélectionné) */}
        <BottomBar
          selectedId={selectedId}
          config={configs[selectedId]}
          hauteur={hauteurs[selectedId]}
          isTiroirsInterieurs={tiroirsInt[selectedId]}
          onConfigChange={(value) => setConfigs((p) => ({ ...p, [selectedId]: value }))}
          onHauteurChange={(value) => setHauteurs((p) => ({ ...p, [selectedId]: value }))}
          onTiroirsTypeChange={(value) => setTiroirsInt((p) => ({ ...p, [selectedId]: value }))}
        />

        {/* Scène 3D */}
        <Scene
          largeurTotaleCM={largeurTotaleCM}
          hauteurs={hauteurs}
          orbitRef={orbitRef}
          onPointerMissed={() => setSelectedId(null)}
        >
          <Room couleurMur={couleurMur} couleurSol={couleurSol} profondeurCM={profondeurCM} />
          <group>{renderCaissons()}</group>
        </Scene>
      </div>
    </div>
  );
}
