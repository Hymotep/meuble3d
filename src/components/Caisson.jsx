// NOUVEAU : On importe useMemo
import React, { useState, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// NOUVEAU : On récupère la prop "couleur"
export function Caisson({ largeur, hauteur, activeConfig, isSelected, onClick, couleur, ...props }) {
  const { nodes } = useGLTF('/models/caisson.glb')
  
  const [isHovered, setIsHovered] = useState(false)
  const doorRef = useRef()
  const drawerRef = useRef()

  const BASE_WIDTH = 600;
  const BASE_HEIGHT = 812;
  const EPAISSEUR = 18;

  // --- NOUVEAU : CRÉATION DU MATÉRIAU PERSONNALISÉ ---
  // On utilise notre propre matériau (MeshStandardMaterial) au lieu de celui du fichier GLB
  const customMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: couleur,
      roughness: 0.8, // 0 = lisse comme un miroir, 1 = mat comme du carton. 0.8 est parfait pour du bois/mélaminé.
    })
  }, [couleur]) // Ne se recrée que si la variable 'couleur' change

  // CALCULS
  const scaleX_horizontales = largeur / BASE_WIDTH;
  const scaleX_etagere = (largeur - (EPAISSEUR * 2)) / (BASE_WIDTH - (EPAISSEUR * 2));
  const scaleZ_verticales = (hauteur - (EPAISSEUR * 2)) / (BASE_HEIGHT - (EPAISSEUR * 2));
  const scaleZ_fond = hauteur / BASE_HEIGHT;

  const deltaX = largeur - BASE_WIDTH;
  const scaleX_tiroir_face = (554 + deltaX) / 554;
  const scaleX_tiroir_fond = (518 + deltaX) / 518;

  // ANIMATIONS
  useFrame(() => {
    if (doorRef.current) {
      const targetRotation = (isHovered && activeConfig === 1) ? -Math.PI / 2 : 0;
      doorRef.current.rotation.z = THREE.MathUtils.lerp(doorRef.current.rotation.z, targetRotation, 0.1)
    }
    if (drawerRef.current) {
      const targetPosition = (isHovered && activeConfig === 2) ? -300 : 0;
      drawerRef.current.position.y = THREE.MathUtils.lerp(drawerRef.current.position.y, targetPosition, 0.1)
    }
  })

  return (
    <group 
      {...props} 
      dispose={null}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group scale={0.001}>
          
          {/* CAISSON : Remarque que material={customMaterial} est appliqué partout ! */}
          <mesh geometry={nodes.Geom3D_traversse_bas.geometry} material={customMaterial} scale={[25.4 * scaleX_horizontales, 25.4, 25.4]} />
          <mesh geometry={nodes.Geom3D_montant_droit.geometry} material={customMaterial} position={[0, 0, EPAISSEUR]} scale={[25.4, 25.4, 25.4 * scaleZ_verticales]} />
          <mesh geometry={nodes.Geom3D_montant_gauche.geometry} material={customMaterial} position={[largeur - EPAISSEUR, 0, EPAISSEUR]} scale={[25.4, 25.4, 25.4 * scaleZ_verticales]} />
          <mesh geometry={nodes.Geom3D_traverse_haut.geometry} material={customMaterial} position={[0, 0, hauteur - EPAISSEUR]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4]} />
          <mesh geometry={nodes.Geom3D_fond_arrière.geometry} material={customMaterial} position={[0, 600, 0]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]} />
          <mesh geometry={nodes.Geom3D_étagère_1.geometry} material={customMaterial} position={[EPAISSEUR, 0, hauteur / 2]} scale={[25.4 * scaleX_etagere, 25.4, 25.4]} />

          {/* PORTE */}
          <group visible={activeConfig === 1}>
            <mesh ref={doorRef} geometry={nodes.Geom3D_porte.geometry} material={customMaterial} position={[0, -18, 0]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]} />
          </group>

          {/* TIROIRS */}
          <group visible={activeConfig === 2}>
            <group ref={drawerRef}>
              <mesh geometry={nodes.Geom3D_tiroir_gauche.geometry} material={customMaterial} position={[23.875, 15.67, 53.615]} scale={25.4} />
              <mesh geometry={nodes.Geom3D_tiroir_droit.geometry} material={customMaterial} position={[559.875 + deltaX, 15.67, 53.615]} scale={25.4} />
              <mesh geometry={nodes.Geom3D_tiroir_face.geometry} material={customMaterial} position={[23.875, -2.33, 35.615]} scale={[25.4 * scaleX_tiroir_face, 25.4, 25.4]} />
              <mesh geometry={nodes.Geom3D_tiroir_fond.geometry} material={customMaterial} position={[41.875, 569.67, 53.615]} scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4]} />
              <mesh geometry={nodes.Geom3D_tiroir_bas.geometry} material={customMaterial} position={[1023.032 + deltaX*1.87, 118.07, 0]} scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4]} />
            </group>
          </group>

          {/* SÉLECTEUR ROUGE TYLKO */}
          {isSelected && (
            <mesh position={[largeur / 2, 300, hauteur / 2]}>
              <boxGeometry args={[largeur + 4, 604, hauteur + 4]} />
              <meshBasicMaterial color="#ff4a36" transparent opacity={0.3} depthWrite={false} />
            </mesh>
          )}

        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/caisson.glb')