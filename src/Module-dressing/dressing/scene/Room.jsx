import React from "react";

/**
 * ============================================================================
 * ROOM - Rendu 3D du mur et du sol
 * ============================================================================
 * Ce composant affiche l'environnement de la pièce :
 * - Un plan de sol (floor)
 * - Un mur arrière (back wall)
 * 
 * Les couleurs sont paramétrables par l'utilisateur.
 */

export function Room({ couleurMur, couleurSol, profondeurCM }) {
  /**
   * Position du mur : légèrement derrière le dressing
   * (profondeurCM / 99 pour laisser un petit espace)
   */
  const zMur = -(profondeurCM / 99);

  return (
    <group position={[0, -0.01, 0]}>
      {/* SOL - Plan horizontal */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color={couleurSol} roughness={0.9} metalness={0} />
      </mesh>

      {/* MUR - Plan vertical arrière */}
      <mesh receiveShadow position={[0, 25, zMur]}>
        <planeGeometry args={[150, 50]} />
        <meshStandardMaterial color={couleurMur} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export default Room;
