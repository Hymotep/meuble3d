import React, { useState, useRef } from 'react'
import { useControls, folder } from 'leva' // N'oublie pas d'importer 'folder'
import { Caisson } from './Caisson'

export function Parent() {
  const [selectedId, setSelectedId] = useState(null) 
  const [configs, setConfigs] = useState({}) 
  const [hauteurs, setHauteurs] = useState({}) 
  const [tiroirsInt, setTiroirsInt] = useState({}) 

  const hauteursRef = useRef(hauteurs)
  hauteursRef.current = hauteurs

  const tiroirsIntRef = useRef(tiroirsInt)
  tiroirsIntRef.current = tiroirsInt

  // --- MENU LEVA : CONFIGURATION GLOBALE ORGANISEE ---
  const { 
    largeurTotaleCM, profondeurCM, 
    finitionExt, couleurExt, 
    finitionInt, couleurInt,
    avecPoignees, couleurPoignees 
  } = useControls({
    '📏 DIMENSIONS DU MEUBLE': folder({
      largeurTotaleCM: { value: 120, min: 40, max: 600, step: 1, label: "Largeur (cm)" },
      profondeurCM: { value: 60, min: 30, max: 100, step: 1, label: "Profondeur (cm)" }
    }),
    
    '🎨 DESIGN EXTERIEUR': folder({
      finitionExt: { options: ['Couleur', 'Chêne'], label: "Matière" },
      couleurExt: { value: '#e2b388', label: "Couleur" }
    }),

    '🪵 DESIGN INTERIEUR': folder({
      finitionInt: { options: ['Couleur', 'Chêne'], label: "Matière" },
      couleurInt: { value: '#ffffff', label: "Couleur" }
    }),

    '🚪 ACCESSOIRES': folder({
      avecPoignees: { value: true, label: "Activer poignées" },
      couleurPoignees: { value: '#222222', label: "Couleur" }
    })
  });

  const profondeur = profondeurCM * 10; 

  // LOGIQUE DE DÉCOUPE DES CAISSONS
  const widths = [];
  let remainingCM = largeurTotaleCM;

  while (remainingCM >= 120) {
    widths.push(800); 
    remainingCM -= 80;
  }
  if (remainingCM > 0) {
    widths.push(remainingCM * 10);
  }

  const GAP = 2; 
  if (widths.length > 1) {
    const totalGaps = GAP * (widths.length - 1);
    widths[widths.length - 1] -= totalGaps;
  }

  // --- MENU LEVA : CAISSON SÉLECTIONNÉ ---
  useControls('🎯 CAISSON SÉLECTIONNÉ', () => {
    // Si rien n'est sélectionné, on cache ce menu pour ne pas polluer l'interface
    if (selectedId === null) return {}; 
    
    const currentConfig = configs[selectedId] !== undefined ? configs[selectedId] : 4;
    const hasDrawers = [1, 4, 6, 7, 8].includes(currentConfig);

    const controls = {
      [`config_${selectedId}`]: {
        label: `Agencement (N°${selectedId + 1})`,
        options: {
          'Vide (1 Étagère)': 0,
          'Dressing (2 Tiroirs + Penderie)': 1,
          'Dressing (3 Tiroirs + Penderie)': 6,
          'Dressing (4 Tiroirs + Penderie)': 7,
          'Mixte (Porte haute + 2 Tiroirs)': 4,
          'Mixte (Porte haute + 3 Tiroirs)': 8,
          'Bibliothèque (4 Étagères)': 2,
          'Fermé (Porte totale)': 3,
          'Penderie (Barre + Étagère)': 5 
        },
        value: currentConfig,
        onChange: (v) => setConfigs(prev => ({ ...prev, [selectedId]: v }))
      },
      
      [`hauteur_${selectedId}`]: {
        label: 'Hauteur (cm)', 
        value: hauteursRef.current[selectedId] || 200, 
        min: 50, max: 250, step: 1,
        onChange: (v) => setHauteurs(prev => ({ ...prev, [selectedId]: v }))
      }
    };

    // On affiche l'option des tiroirs avec des labels beaucoup plus explicites
    if (hasDrawers) {
      controls[`tiroirsInt_${selectedId}`] = {
        label: 'Type de tiroirs',
        options: { 'Visibles (Extérieurs)': false, 'Cachés (Intérieurs)': true },
        value: tiroirsIntRef.current[selectedId] || false,
        onChange: (v) => setTiroirsInt(prev => ({ ...prev, [selectedId]: v }))
      };
    }

    return controls;
  }, [selectedId, configs]) 

  const caissonsGeneres = [];
  const largeurTotaleMM = largeurTotaleCM * 10;
  let currentPositionX = -largeurTotaleMM / 2;

  for (let i = 0; i < widths.length; i++) {
    const currentConfig = configs[i] !== undefined ? configs[i] : 4; 
    const currentHauteur = (hauteurs[i] || 200) * 10; 
    const currentTiroirsInt = tiroirsInt[i] || false; 
    const isRightHinge = i % 2 !== 0;

    caissonsGeneres.push(
      <Caisson 
        key={i} 
        position={[currentPositionX / 1000, 0, 0]} 
        largeur={widths[i]}  
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
        isTiroirsInterieurs={currentTiroirsInt} 
        isRightHinge={isRightHinge}
        onClick={(e) => {
          e.stopPropagation(); 
          setSelectedId(i);    
        }}
      />
    );
    currentPositionX += widths[i] + GAP;
  }

  return (
    <group onPointerMissed={() => setSelectedId(null)}>
      {caissonsGeneres}
    </group>
  )
}