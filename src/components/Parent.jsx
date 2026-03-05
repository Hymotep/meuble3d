import React, { useState, useRef } from 'react'
import { useControls, buttonGroup } from 'leva'
import { Caisson } from './Caisson'

export function Parent() {
  const [selectedId, setSelectedId] = useState(null) 
  const [configs, setConfigs] = useState({}) 
  const [hauteurs, setHauteurs] = useState({}) 

  const hauteursRef = useRef(hauteurs)
  hauteursRef.current = hauteurs

  // 1. NOUVEAU : Ajout de la couleur dans les contrôles globaux
  const { largeurTotaleCM, couleurMeuble } = useControls('Configuration Globale', {
    largeurTotaleCM: { value: 60, min: 30, max: 320, step: 1, label: "Largeur totale (cm)" },
    // Leva va détecter le "#" et créer un color picker tout seul !
    couleurMeuble: { value: '#e2b388', label: "Couleur" } 
  })

  const largeurTotale = largeurTotaleCM * 10; 

  useControls('Caisson Sélectionné', () => {
    if (selectedId === null) return {}; 
    return {
      'Type': buttonGroup({
        'Base': () => setConfigs(prev => ({ ...prev, [selectedId]: 0 })),
        'Portes': () => setConfigs(prev => ({ ...prev, [selectedId]: 1 })),
        'Tiroirs': () => setConfigs(prev => ({ ...prev, [selectedId]: 2 }))
      }),
      [`hauteur_${selectedId}`]: {
        label: 'Hauteur (cm)', 
        value: hauteursRef.current[selectedId] || 81, 
        min: 40, max: 200, step: 1,
        onChange: (v) => setHauteurs(prev => ({ ...prev, [selectedId]: v }))
      }
    }
  }, [selectedId]) 

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
        activeConfig={currentConfig} 
        isSelected={selectedId === i} 
        // 2. NOUVEAU : On transmet la couleur choisie au caisson
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