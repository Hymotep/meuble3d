import * as THREE from "three";
import React from "react";

export const renderPoignee = (avecPoignees, couleurPoignees, doorWidth, doorHeight) => {
  if (!avecPoignees) return null;

  const posX = doorWidth - 30;
  const posY = -15;
  const posZ = doorHeight / 2;

  return (
    <mesh position={[posX, posY, posZ]}>
      <boxGeometry args={[12, 20, 150]} />
      <meshStandardMaterial color={couleurPoignees} metalness={0.6} roughness={0.3} />
    </mesh>
  );
};

export const renderPorteGauche = (ref, geometry, matExt, position, scale, doorWidth, doorHeight, avecPoignees, couleurPoignees, scaleXLeft) => (
  <mesh
    ref={ref}
    geometry={geometry}
    material={matExt}
    position={position}
    scale={scale}
  >
    <group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * (doorHeight / 25.4))]}>
      {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
    </group>
  </mesh>
);

export const renderPorteDroite = (ref, geometry, matExt, position, scale, doorWidth, doorHeight, avecPoignees, couleurPoignees, scaleXRight) => (
  <mesh
    ref={ref}
    geometry={geometry}
    material={matExt}
    position={position}
    scale={scale}
  >
    <group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * (doorHeight / 25.4))]}>
      {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
    </group>
  </mesh>
);

export const renderPortes = (
  nodes,
  matExt,
  largeur,
  scaleZ,
  EPAISSEUR,
  scaleX_horizontales,
  avecPoignees,
  couleurPoignees,
  isRightHinge,
  leftDoorRef,
  rightDoorRef,
  zOffset,
  doorsCount
) => {
  // --- LOGIQUE DU CUISINISTE : LE JEU DE FONCTIONNEMENT ---
  const JEU_GLOBAL_MM = 3; // 3mm de jeu total (largeur & hauteur)
  const JEU_BORD = 1.5;    // 1.5mm de décalage par rapport au bord du caisson

  // 1. Ajustement de la hauteur (On évite que ça frotte en haut et en bas)
  const HAUTEUR_PORTE_ORIGINE = 812 - EPAISSEUR;
  const doorHeight = (HAUTEUR_PORTE_ORIGINE * scaleZ) - JEU_GLOBAL_MM;
  const scaleZPorte = doorHeight / HAUTEUR_PORTE_ORIGINE; // Nouveau scaleZ ajusté

  // 2. Ajustement de la largeur
  if (doorsCount === 2) {
    // Caisson Double : 1.5mm à gauche + 3mm au centre + 1.5mm à droite = 6mm de vide total
    const doorWidth = (largeur - (JEU_GLOBAL_MM * 2)) / 2;
    
    // Le scaleX est proportionnel à la nouvelle vraie largeur de la porte
    const scaleXLeft = 25.4 * scaleX_horizontales * (doorWidth / largeur);
    const scaleXRight = -scaleXLeft; // On inverse pour la porte droite

    // On décale le point d'ancrage des charnières vers l'intérieur
    const posLeftX = JEU_BORD;
    const posRightX = largeur - JEU_BORD;

    return (
      <group>
        <mesh ref={leftDoorRef} geometry={nodes.Geom3D_porte.geometry} material={matExt} position={[posLeftX, -18 + JEU_BORD, zOffset]} scale={[scaleXLeft, 25.4, 25.4 * scaleZPorte]}>
          <group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZPorte)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
        <mesh ref={rightDoorRef} geometry={nodes.Geom3D_porte.geometry} material={matExt} position={[posRightX, -18 + JEU_BORD, zOffset]} scale={[scaleXRight, 25.4, 25.4 * scaleZPorte]}>
          <group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZPorte)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
      </group>
    );
  } else {
    // Caisson Simple : 1.5mm à gauche + 1.5mm à droite = 3mm de vide total
    const doorWidth = largeur - JEU_GLOBAL_MM;
    const scaleX = 25.4 * scaleX_horizontales * (doorWidth / largeur);
    
    if (isRightHinge) {
      const scaleXRight = -scaleX;
      const posRightX = largeur - JEU_BORD; // La charnière est à droite, on la rentre de 1.5mm
      return (
        <mesh ref={rightDoorRef} geometry={nodes.Geom3D_porte.geometry} material={matExt} position={[posRightX, -18 + JEU_BORD, zOffset]} scale={[scaleXRight, 25.4, 25.4 * scaleZPorte]}>
          <group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZPorte)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
      );
    } else {
      const scaleXLeft = scaleX;
      const posLeftX = JEU_BORD; // La charnière est à gauche, on la rentre de 1.5mm
      return (
        <mesh ref={leftDoorRef} geometry={nodes.Geom3D_porte.geometry} material={matExt} position={[posLeftX, -18 + JEU_BORD, zOffset]} scale={[scaleXLeft, 25.4, 25.4 * scaleZPorte]}>
          <group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZPorte)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
      );
    }
  }
};

export const doorAnimation = (leftDoorRef, rightDoorRef, isHovered, hasDrawers) => {
  if (!leftDoorRef.current && !rightDoorRef.current) return;

  const angleDeBase = Math.PI / 2.5;
  const angleOuvert = Math.PI / 2;

  if (leftDoorRef.current) {
    const targetRotationLeft = isHovered && hasDrawers ? -angleOuvert : -angleDeBase;
    leftDoorRef.current.rotation.z = THREE.MathUtils.lerp(leftDoorRef.current.rotation.z, targetRotationLeft, 0.1);
  }
  if (rightDoorRef.current) {
    const targetRotationRight = isHovered && hasDrawers ? angleOuvert : angleDeBase;
    rightDoorRef.current.rotation.z = THREE.MathUtils.lerp(rightDoorRef.current.rotation.z, targetRotationRight, 0.1);
  }
};
