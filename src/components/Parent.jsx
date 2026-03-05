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
    largeurTotaleCM: { value: 60, min: 30, max: 320, step: 1, label: "Largeur (cm)" },
    profondeurCM: { value: 60, min: 30, max: 100, step: 1, label: "Profondeur (cm)" },
    couleurMeuble: { value: '#e2b388', label: "Couleur" } 
  })

  const largeurTotale = largeurTotaleCM * 10; 
  const profondeur = profondeurCM * 10; 

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
        value: configs[selectedId] || 0,
        onChange: (v) => setConfigs(prev => ({ ...prev, [selectedId]: v }))
      },
      
      [`hauteur_${selectedId}`]: {
        label: 'Hauteur (cm)', 
        value: hauteursRef.current[selectedId] || 81, 
        min: 50, max: 200, step: 1,
        onChange: (v) => setHauteurs(prev => ({ ...prev, [selectedId]: v }))
      }
    }
  }, [selectedId, configs]) 

  const MAX_LARGEUR_CAISSON = 600; 
  const GAP = 2; 

  const nbCaissons = Math.ceil(largeurTotale / MAX_LARGEUR_CAISSON);
  const espaceTotalGaps = GAP * (nbCaissons - 1);
  const largeurParCaisson = (largeurTotale - espaceTotalGaps) / nbCaissons;

  const caissonsGeneres = [];

  for (let i = 0; i < nbCaissons; i++) {
    const positionX = (i * (largeurParCaisson + GAP)) / 1000;
    const currentConfig = configs[i] || 0; 
    const currentHauteur = (hauteurs[i] || 81) * 10; 

    caissonsGeneres.push(
      <Caisson 
        key={i} 
        position={[positionX, 0, 0]} 
        largeur={largeurParCaisson}  
        hauteur={currentHauteur} 
        profondeur={profondeur} 
        activeConfig={currentConfig} 
        isSelected={selectedId === i} 
        couleur={couleurMeuble}
        onClick={(e) => {
          e.stopPropagation(); 
          setSelectedId(i);    
        }}
      />
    );
  }

  return (
    <group onPointerMissed={() => setSelectedId(null)}>
      {caissonsGeneres}
    </group>
  )
}