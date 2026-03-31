/**
 * ============================================================================
 * USE DRESSING STATE HOOK
 * ============================================================================
 * Gère tout l'état global du configurateur de dressing, les calculs de
 * dimensions, les positions X des caissons, et les presets.
 */

import { useState, useMemo } from "react";
import { calculateCaissonDimensions } from "../../../utils/caissonCalculations.js";
import { calculateTotalPrice } from "../../../utils/priceCalculation.js"; // À migrer sur le backend plus tard !
import { DEFAULTS, DOOR_CONFIG } from "../../../utils/constants.js";

export const useDressingState = () => {
    // 1. ÉTATS
    const [selectedId, setSelectedId] = useState(null);
    const [configs, setConfigs] = useState({});
    const [hauteurs, setHauteurs] = useState({});
    const [tiroirsInt, setTiroirsInt] = useState({});
    const [largeurTotaleCM, setLargeurTotaleCM] = useState(DEFAULTS.LARGEUR);
    const [profondeurCM, setProfondeurCM] = useState(DEFAULTS.PROFONDEUR);
    const [finitionExt, setFinitionExt] = useState(DEFAULTS.FINITION_EXT);
    const [couleurExt, setCouleurExt] = useState("#e2b388");
    const [finitionInt, setFinitionInt] = useState(DEFAULTS.FINITION_INT);
    const [couleurInt, setCouleurInt] = useState("#ffffff");
    const [avecPoignees, setAvecPoignees] = useState(DEFAULTS.AVEC_POIGNEES);
    const [couleurPoignees, setCouleurPoignees] = useState("#222222");
    const [avecLED, setAvecLED] = useState(DEFAULTS.AVEC_LED);
    const [couleurMur, setCouleurMur] = useState("#f1f5f9");
    const [couleurSol, setCouleurSol] = useState("#e5e7eb");

    const profondeur = profondeurCM * 10;

    // 2. CALCULS DE DIMENSIONS ET POSITIONS
    const caissonsData = useMemo(() => {
        const dimensions = calculateCaissonDimensions(largeurTotaleCM);
        let currentPositionX = -((largeurTotaleCM * 10) / 2);

        // On enrichit les données avec la position X exacte pour nettoyer le JSX plus tard
        return dimensions.map((caisson, index) => {
            const posX = currentPositionX;
            currentPositionX += caisson.width + DOOR_CONFIG.GAP; // Décalage pour le suivant
            
            return {
                ...caisson,
                id: index,
                positionX: posX / 1000, // Conversion en mètres pour Three.js
                configId: configs[index] !== undefined ? configs[index] : 4,
                hauteurMM: (hauteurs[index] || 200) * 10,
                isTiroirsInt: tiroirsInt[index] || false,
                isRightHinge: index % 2 !== 0
            };
        });
    }, [largeurTotaleCM, configs, hauteurs, tiroirsInt]);

    // 3. CALCUL DU PRIX (Rappel : finira sur l'API Node.js)
    const totalPrice = useMemo(() => {
        return calculateTotalPrice(
            caissonsData, hauteurs, configs, profondeurCM,
            finitionExt, finitionInt, avecLED, avecPoignees
        );
    }, [caissonsData, hauteurs, configs, profondeurCM, finitionExt, finitionInt, avecLED, avecPoignees]);

    // 4. CHARGEMENT DE PRESET
    const loadPreset = (preset) => {
        setLargeurTotaleCM(preset.dimensions.largeur);
        setProfondeurCM(preset.dimensions.profondeur);
        setFinitionExt(preset.finish.exterior);
        setFinitionInt(preset.finish.interior);
        if (preset.finish.couleurExt) setCouleurExt(preset.finish.couleurExt);
        if (preset.finish.couleurInt) setCouleurInt(preset.finish.couleurInt);
        setAvecPoignees(preset.options.avecPoignees);
        setAvecLED(preset.options.avecLED);
        setConfigs(preset.configs);
        setHauteurs(preset.hauteurs);
        setCouleurMur(preset.room.mur);
        setCouleurSol(preset.room.sol);
        setSelectedId(null);
    };

    // On retourne un objet regroupant tout ce dont le JSX a besoin
    return {
        state: {
            selectedId, configs, hauteurs, tiroirsInt, largeurTotaleCM, profondeurCM,
            finitionExt, couleurExt, finitionInt, couleurInt, avecPoignees,
            couleurPoignees, avecLED, couleurMur, couleurSol, profondeur
        },
        actions: {
            setSelectedId, setConfigs, setHauteurs, setTiroirsInt, setLargeurTotaleCM,
            setProfondeurCM, setFinitionExt, setCouleurExt, setFinitionInt, setCouleurInt,
            setAvecPoignees, setCouleurPoignees, setAvecLED, setCouleurMur, setCouleurSol,
            loadPreset
        },
        computed: { caissonsData, totalPrice }
    };
};