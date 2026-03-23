import * as THREE from "three";
import React from "react";

export const renderEtagere = (nodes, matInt, EPAISSEUR, scaleX_etagere, scaleY_profondeur, hauteurZ, key) => (
  <mesh
    key={key}
    geometry={nodes.Geom3D_étagère_1.geometry}
    material={matInt}
    position={[EPAISSEUR, 0, hauteurZ]}
    scale={[25.4 * scaleX_etagere, 25.4 * scaleY_profondeur, 25.4]}
  />
);

export const renderPenderie = (largeur, EPAISSEUR, profondeur, hauteurEtagere, key) => {
  const longueurBarre = largeur - EPAISSEUR * 2;
  return (
    <mesh key={key} position={[largeur / 2, profondeur / 2, hauteurEtagere - 40]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[12, 12, longueurBarre, 32]} />
      <meshStandardMaterial color="#d0d4d8" metalness={0.9} roughness={0.15} />
    </mesh>
  );
};

export const renderTiroirs = (
  nodes,
  matInt,
  matExt,
  nbTiroirs,
  isTiroirsInterieurs,
  scaleX_tiroir_face,
  scaleX_tiroir_fond,
  scaleY_tiroir_prof,
  scaleZ_tiroir,
  deltaX,
  deltaY,
  drawerRef
) => {
  const facadeMaterial = isTiroirsInterieurs ? matInt : matExt;
  const tiroirsGeneres = [];

  for (let i = 0; i < nbTiroirs; i++) {
    const zOffset = i * (300 / nbTiroirs);
    tiroirsGeneres.push(
      <group key={i} position={[0, 0, zOffset]}>
        <mesh
          geometry={nodes.Geom3D_tiroir_gauche.geometry}
          material={matInt}
          position={[23.875, 15.67, 53.615]}
          scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]}
        />
        <mesh
          geometry={nodes.Geom3D_tiroir_droit.geometry}
          material={matInt}
          position={[559.875 + deltaX, 15.67, 53.615]}
          scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]}
        />
        <mesh
          geometry={nodes.Geom3D_tiroir_face.geometry}
          material={facadeMaterial}
          position={[23.875, -2.33, 35.615]}
          scale={[25.4 * scaleX_tiroir_face, 25.4, 25.4 * scaleZ_tiroir]}
        />
        <mesh
          geometry={nodes.Geom3D_tiroir_fond.geometry}
          material={matInt}
          position={[41.875, 569.67 + deltaY, 53.615]}
          scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4 * scaleZ_tiroir]}
        />
        <mesh
          geometry={nodes.Geom3D_tiroir_bas.geometry}
          material={matInt}
          position={[1023.032 + deltaX * 1.87, 118.07 + deltaY * 0.207, 0]}
          scale={[25.4 * scaleX_tiroir_fond, 25.4 * scaleY_tiroir_prof, 25.4]}
        />
      </group>
    );
  }
  return <group ref={drawerRef}>{tiroirsGeneres}</group>;
};

export const drawerAnimation = (drawerRef, isHovered, isTiroirsInterieurs, hasDrawers) => {
  if (!drawerRef.current) return;

  const baseDrawerY = isTiroirsInterieurs ? 20 : 0;
  const targetPosition = isHovered && hasDrawers ? -300 : baseDrawerY;
  drawerRef.current.position.y = THREE.MathUtils.lerp(drawerRef.current.position.y, targetPosition, 0.1);
};

export const getActiveConfigElements = (
  activeConfig,
  renderEtagereFn,
  renderPenderieFn,
  renderTiroirsFn,
  hauteur
) => {
  const elements = [];

  if (activeConfig === 0) {
    elements.push(renderEtagereFn(hauteur / 2, "etagere-centre"));
  }

  if ([1, 6, 7].includes(activeConfig)) {
    elements.push(
      <group key="group-tiroirs-1">
        {renderTiroirsFn()}
        {renderEtagereFn(hauteur - 300, "etagere-haute")}
        {renderPenderieFn(hauteur - 300, "penderie-1")}
      </group>
    );
  }

  if (activeConfig === 2) {
    elements.push(
      <group key="group-biblio">
        {[1, 2, 3, 4].map((i) => renderEtagereFn((hauteur / 5) * i, `etagere-biblio-${i}`))}
      </group>
    );
  }

  if (activeConfig === 3) {
    elements.push(
      <group key="group-cachee">
        {renderEtagereFn(hauteur - 300, "etagere-cachee")}
        {renderPenderieFn(hauteur - 300, "penderie-cachee")}
      </group>
    );
  }

  if ([4, 8].includes(activeConfig)) {
    elements.push(renderTiroirsFn());
  }

  if (activeConfig === 5) {
    elements.push(
      <group key="group-penderie-simple">
        {renderEtagereFn(hauteur - 300, "etagere-penderie")}
        {renderPenderieFn(hauteur - 300, "barre-penderie-simple")}
      </group>
    );
  }

  return elements;
};
