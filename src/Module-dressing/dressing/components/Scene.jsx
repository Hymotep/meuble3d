import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CAMERA_CONFIG } from "../../utils/constants.js";

/**
 * ============================================================================
 * AUTO-FIT CAMERA - Caméra automatique qui s'adapte aux dimensions
 * ============================================================================
 * Ce composant ajuste automatiquement la caméra 3D pour que tout le dressing
 * soit visible dans le cadre, quelle que soit sa taille.
 */

function AutoFitCamera({ largeurTotaleCM, hauteurs, orbitRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!orbitRef.current) return;

    const controls = orbitRef.current;
    const widthMeters = largeurTotaleCM / 100;
    const heightsArr = Object.values(hauteurs);
    const maxHMeters = heightsArr.length > 0 ? Math.max(...heightsArr) / 100 : 2;
    const centerHeight = maxHMeters / 2;

    controls.target.set(0, centerHeight, 0);

    const fov = (camera.fov * Math.PI) / 180;
    const fitHeightDistance = maxHMeters / (2 * Math.tan(fov / 2));
    const fitWidthDistance = widthMeters / camera.aspect / (2 * Math.tan(fov / 2));
    const idealDistance = Math.max(fitHeightDistance, fitWidthDistance) + 2.0;

    controls.minDistance = 1.0;
    controls.maxDistance = idealDistance + 1.0;

    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    spherical.radius = idealDistance;
    camera.position.setFromSpherical(spherical).add(controls.target);
    controls.update();
  }, [largeurTotaleCM, hauteurs, camera, orbitRef]);

  return null;
}

/**
 * ============================================================================
 * SCENE - Configuration principale de la scène 3D
 * ============================================================================
 * Ce composant configure :
 * - L'environnement (lumières, ombres)
 * - Les contrôles de caméra
 * - Le rendu 3D (children)
 */

export function Scene({
  children,
  largeurTotaleCM,
  hauteurs,
  orbitRef,
  onPointerMissed,
}) {
  return (
    <Canvas shadows camera={{ position: CAMERA_CONFIG.POSITION, fov: CAMERA_CONFIG.FOV }}>
      {/* Caméra automatique qui s'adapte aux dimensions */}
      <AutoFitCamera
        largeurTotaleCM={largeurTotaleCM}
        hauteurs={hauteurs}
        orbitRef={orbitRef}
      />

      {/* Éclairage ambiant (lumière douce générale) */}
      <ambientLight intensity={0.4} />

      {/* Lumière directionnelle (soleil) avec ombres */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Environment preset pour les réflexions réalistes */}
      <Environment preset="apartment" blur={0.5} />

      {/* Ombres de contact au sol */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={20}
        blur={2.5}
        far={2}
        resolution={1024}
        color="#1e293b"
      />

      {/* Contenu de la scène (pièce + caissons) */}
      <group onPointerMissed={onPointerMissed}>{children}</group>

      {/* Contrôles orbitaux (rotation/zoom) */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        minPolarAngle={CAMERA_CONFIG.MIN_POLAR_ANGLE}
        maxPolarAngle={CAMERA_CONFIG.MAX_POLAR_ANGLE}
        minAzimuthAngle={CAMERA_CONFIG.MIN_AZIMUTH_ANGLE}
        maxAzimuthAngle={CAMERA_CONFIG.MAX_AZIMUTH_ANGLE}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}

export default Scene;
