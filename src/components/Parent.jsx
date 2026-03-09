import React, { useState, useRef } from 'react'
import { useControls } from 'leva'
import { Caisson } from './Caisson'

export function Parent() {
  const [selectedId, setSelectedId] = useState(null) 
  const [configs, setConfigs] = useState({}) 
  const [hauteurs, setHauteurs] = useState({}) 

  const hauteursRef = useRef(hauteurs)
  hauteursRef.current = hauteurs

  const { largeurTotaleCM, profondeurCM, couleurMeuble } = useControls('Configuration Globale', {
    largeurTotaleCM: { value: 120, min: 40, max: 600, step: 1, label: "Largeur (cm)" },
    profondeurCM: { value: 60, min: 30, max: 100, step: 1, label: "Profondeur (cm)" },
    couleurMeuble: { value: '#e2b388', label: "Couleur" } 
  })

  const profondeur = profondeurCM * 10; 

  // NOUVELLE LOGIQUE DE DÉCOUPE DES CAISSONS
  const widths = [];
  let remainingCM = largeurTotaleCM;

  // Tant qu'on a 120cm ou plus, on crée un bloc de 80cm
  while (remainingCM >= 120) {
    widths.push(800); // 80 cm en mm
    remainingCM -= 80;
  }
  // Le reste va dans le dernier bloc (qui fera donc entre 40 et 119 cm)
  if (remainingCM > 0) {
    widths.push(remainingCM * 10);
  }

  const GAP = 2; // Espace entre les caissons en mm
  // On retire l'espace des gaps sur le dernier caisson pour respecter la taille totale au millimètre
  if (widths.length > 1) {
    const totalGaps = GAP * (widths.length - 1);
    widths[widths.length - 1] -= totalGaps;
  }

  useControls('Caisson Sélectionné', () => {
    if (selectedId === null) return {}; 
    
    return {
      [`config_${selectedId}`]: {
        label: 'Agencement',
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
        value: configs[selectedId] !== undefined ? configs[selectedId] : 4,
        onChange: (v) => setConfigs(prev => ({ ...prev, [selectedId]: v }))
      },
      
      [`hauteur_${selectedId}`]: {
        label: 'Hauteur (cm)', 
        value: hauteursRef.current[selectedId] || 200, 
        min: 50, max: 250, step: 1,
        onChange: (v) => setHauteurs(prev => ({ ...prev, [selectedId]: v }))
      }
    }
  }, [selectedId, configs]) 

  const caissonsGeneres = [];
  
  // LA MAGIE EST ICI : On recule le point de départ de la moitié de la largeur totale !
  const largeurTotaleMM = largeurTotaleCM * 10;
  let currentPositionX = -largeurTotaleMM / 2;

  for (let i = 0; i < widths.length; i++) {
    const currentConfig = configs[i] !== undefined ? configs[i] : 4; 
    const currentHauteur = (hauteurs[i] || 200) * 10; 
    const isRightHinge = i % 2 !== 0;

    caissonsGeneres.push(
      <Caisson 
        key={i} 
        position={[currentPositionX / 1000, 0, 0]} // On convertit en mètres pour ThreeJS
        largeur={widths[i]}  
        hauteur={currentHauteur} 
        profondeur={profondeur} 
        activeConfig={currentConfig} 
        isSelected={selectedId === i} 
        couleur={couleurMeuble}
        isRightHinge={isRightHinge}
        onClick={(e) => {
          e.stopPropagation(); 
          setSelectedId(i);    
        }}
      />
    );
    // On avance la position X pour le prochain caisson
    currentPositionX += widths[i] + GAP;
  }

  return (
    <group onPointerMissed={() => setSelectedId(null)}>
      {caissonsGeneres}
    </group>
  )
}