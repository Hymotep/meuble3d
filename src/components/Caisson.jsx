import React, { useState, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Caisson({ largeur, hauteur, profondeur, activeConfig, isSelected, onClick, couleur, ...props }) {
  const { nodes } = useGLTF("/models/caisson.glb");

  const [isHovered, setIsHovered] = useState(false);
  const doorRef = useRef();
  const drawerRef = useRef();

  const BASE_WIDTH = 600;
  const BASE_HEIGHT = 812;
  const BASE_DEPTH = 600; 
  const EPAISSEUR = 18;

  const customMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.8 });
  }, [couleur]);

  const scaleX_horizontales = largeur / BASE_WIDTH;
  const scaleX_etagere = (largeur - EPAISSEUR * 2) / (BASE_WIDTH - EPAISSEUR * 2);
  const scaleZ_verticales = (hauteur - EPAISSEUR * 2) / (BASE_HEIGHT - EPAISSEUR * 2);
  const scaleZ_fond = hauteur / BASE_HEIGHT;
  const scaleY_profondeur = profondeur / BASE_DEPTH;
  const deltaY = profondeur - BASE_DEPTH;

  const deltaX = largeur - BASE_WIDTH;
  const scaleX_tiroir_face = (554 + deltaX) / 554;
  const scaleX_tiroir_fond = (518 + deltaX) / 518;
  const scaleY_tiroir_prof = (569.67 + deltaY) / 569.67;

  const HAUTEUR_BLOC_TIROIR = 300; 
  const HAUTEUR_PORTE_ORIGINE = BASE_HEIGHT - EPAISSEUR; 
  const espaceLibrePourPorte = hauteur - HAUTEUR_BLOC_TIROIR - EPAISSEUR; 
  const scaleZ_demi_porte = espaceLibrePourPorte / HAUTEUR_PORTE_ORIGINE; 

  let nbTiroirs = 2; // Valeur par défaut
  if (activeConfig === 6 || activeConfig === 8) nbTiroirs = 3;
  if (activeConfig === 7) nbTiroirs = 4;

  const HAUTEUR_TIROIR_ORIGINE = 200; 
  const hauteurUnTiroir = HAUTEUR_BLOC_TIROIR / nbTiroirs; 
  const scaleZ_tiroir = hauteurUnTiroir / HAUTEUR_TIROIR_ORIGINE;
  const configsAvecTiroirs = [1, 4, 6, 7, 8];
  const configsAvecPorte = [3, 4, 8];

  useFrame(() => {
    if (doorRef.current) {
      const targetRotation = isHovered && configsAvecPorte.includes(activeConfig) ? -Math.PI / 2 : 0;
      doorRef.current.rotation.z = THREE.MathUtils.lerp(doorRef.current.rotation.z, targetRotation, 0.1);
    }
    if (drawerRef.current) {
      const targetPosition = isHovered && configsAvecTiroirs.includes(activeConfig) ? -300 : 0;
      drawerRef.current.position.y = THREE.MathUtils.lerp(drawerRef.current.position.y, targetPosition, 0.1);
    }
  });

  const renderEtagere = (hauteurZ, key) => (
    <mesh key={key} geometry={nodes.Geom3D_étagère_1.geometry} material={customMaterial} position={[EPAISSEUR, 0, hauteurZ]} scale={[25.4 * scaleX_etagere, 25.4 * scaleY_profondeur, 25.4]} />
  );

  const renderPenderie = (hauteurEtagere, key) => {
    const longueurBarre = largeur - (EPAISSEUR * 2);
    return (
      <mesh key={key} position={[largeur / 2, profondeur / 2, hauteurEtagere - 40]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[12, 12, longueurBarre, 32]} />
        <meshStandardMaterial color="#d0d4d8" metalness={0.9} roughness={0.15} />
      </mesh>
    );
  };

  const renderTiroirs = () => {
    const tiroirsGeneres = [];
    for (let i = 0; i < nbTiroirs; i++) {
      const zOffset = i * hauteurUnTiroir;
      tiroirsGeneres.push(
        <group key={i} position={[0, 0, zOffset]}>
          <mesh geometry={nodes.Geom3D_tiroir_gauche.geometry} material={customMaterial} position={[23.875, 15.67, 53.615]} scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]} />
          <mesh geometry={nodes.Geom3D_tiroir_droit.geometry} material={customMaterial} position={[559.875 + deltaX, 15.67, 53.615]} scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]} />
          <mesh geometry={nodes.Geom3D_tiroir_face.geometry} material={customMaterial} position={[23.875, -2.33, 35.615]} scale={[25.4 * scaleX_tiroir_face, 25.4, 25.4 * scaleZ_tiroir]} />
          <mesh geometry={nodes.Geom3D_tiroir_fond.geometry} material={customMaterial} position={[41.875, 569.67 + deltaY, 53.615]} scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4 * scaleZ_tiroir]} />
          <mesh geometry={nodes.Geom3D_tiroir_bas.geometry} material={customMaterial} position={[1023.032 + deltaX * 1.87, 118.07 + deltaY * 0.207, 0]} scale={[25.4 * scaleX_tiroir_fond, 25.4 * scaleY_tiroir_prof, 25.4]} />
        </group>
      );
    }
    return <group ref={drawerRef}>{tiroirsGeneres}</group>;
  };

  return (
    <group {...props} dispose={null} onClick={onClick} onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }} onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group scale={0.001}>
          
          <mesh geometry={nodes.Geom3D_traversse_bas.geometry} material={customMaterial} scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]} />
          <mesh geometry={nodes.Geom3D_montant_droit.geometry} material={customMaterial} position={[0, 0, EPAISSEUR]} scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]} />
          <mesh geometry={nodes.Geom3D_montant_gauche.geometry} material={customMaterial} position={[largeur - EPAISSEUR, 0, EPAISSEUR]} scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]} />
          <mesh geometry={nodes.Geom3D_traverse_haut.geometry} material={customMaterial} position={[0, 0, hauteur - EPAISSEUR]} scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]} />
          <mesh geometry={nodes.Geom3D_fond_arrière.geometry} material={customMaterial} position={[0, profondeur, 0]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]} />

          {activeConfig === 0 && renderEtagere(hauteur / 2, "etagere-centre")}
          
          {/* NOUVEAU : Si la config fait partie de celles avec des tiroirs + penderie */}
          {[1, 6, 7].includes(activeConfig) && (
            <group>
              {renderTiroirs()} 
              {renderEtagere(hauteur - 300, "etagere-haute")}
              {renderPenderie(hauteur - 300, "penderie-1")}
            </group>
          )}
          
          {activeConfig === 2 && <group> {[1, 2, 3, 4].map((i) => renderEtagere((hauteur / 5) * i, `etagere-biblio-${i}`))} </group>}

          {activeConfig === 3 && (
            <group>
              {renderEtagere(hauteur - 300, "etagere-cachee")}
              {renderPenderie(hauteur - 300, "penderie-cachee")}
              <mesh ref={doorRef} geometry={nodes.Geom3D_porte.geometry} material={customMaterial} position={[0, -18, 0]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]} />
            </group>
          )}

          {/* NOUVEAU : Si la config fait partie des configurations "Mixtes" (Porte + Tiroirs) */}
          {[4, 8].includes(activeConfig) && (
            <group>
              {renderTiroirs()}
              <mesh ref={doorRef} geometry={nodes.Geom3D_porte.geometry} material={customMaterial} position={[0, -18, HAUTEUR_BLOC_TIROIR]} scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_demi_porte]} />
            </group>
          )}

          {activeConfig === 5 && (
            <group>
              {renderEtagere(hauteur - 300, "etagere-penderie")}
              {renderPenderie(hauteur - 300, "barre-penderie-simple")}
            </group>
          )}

          {isSelected && (
            <mesh position={[largeur / 2, profondeur / 2, hauteur / 2]}>
              <boxGeometry args={[largeur + 4, profondeur + 4, hauteur + 4]} />
              <meshBasicMaterial color="#ff4a36" transparent opacity={0.3} depthWrite={false} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/caisson.glb");