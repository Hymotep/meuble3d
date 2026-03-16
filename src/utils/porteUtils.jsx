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
  zOffset
) => {
  const HAUTEUR_PORTE_ORIGINE = 812 - EPAISSEUR;
  const doorHeight = HAUTEUR_PORTE_ORIGINE * scaleZ;

  if (largeur >= 700) {
    const doorWidth = largeur / 2;
    const scaleXLeft = (25.4 * scaleX_horizontales) / 2;
    const scaleXRight = -((25.4 * scaleX_horizontales) / 2);

    return (
      <group>
        <mesh
          ref={leftDoorRef}
          geometry={nodes.Geom3D_porte.geometry}
          material={matExt}
          position={[0, -18, zOffset]}
          scale={[scaleXLeft, 25.4, 25.4 * scaleZ]}
        >
          <group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZ)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>

        <mesh
          ref={rightDoorRef}
          geometry={nodes.Geom3D_porte.geometry}
          material={matExt}
          position={[largeur, -18, zOffset]}
          scale={[scaleXRight, 25.4, 25.4 * scaleZ]}
        >
          <group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZ)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
      </group>
    );
  } else {
    const doorWidth = largeur;
    if (isRightHinge) {
      const scaleXRight = -(25.4 * scaleX_horizontales);
      return (
        <mesh
          ref={rightDoorRef}
          geometry={nodes.Geom3D_porte.geometry}
          material={matExt}
          position={[largeur, -18, zOffset]}
          scale={[scaleXRight, 25.4, 25.4 * scaleZ]}
        >
          <group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZ)]}>
            {renderPoignee(avecPoignees, couleurPoignees, doorWidth, doorHeight)}
          </group>
        </mesh>
      );
    } else {
      const scaleXLeft = 25.4 * scaleX_horizontales;
      return (
        <mesh
          ref={leftDoorRef}
          geometry={nodes.Geom3D_porte.geometry}
          material={matExt}
          position={[0, -18, zOffset]}
          scale={[scaleXLeft, 25.4, 25.4 * scaleZ]}
        >
          <group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZ)]}>
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
