/**
 * ============================================================================
 * SCENE - Configuration principale de la scène 3D
 * ============================================================================
 * Ce composant configure :
 * - L'environnement (lumières, ombres)
 * - Les contrôles de caméra
 * - Le rendu 3D (children)
 */

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { CAMERA_CONFIG } from "../../utils/constants.js";
import { useAutoFitCamera } from "../hooks/Scene/useAutoFitCamera.js";

// Composant invisible qui connecte le hook mathématique au Canvas
function AutoFitCamera({ largeurTotaleCM, hauteurs, orbitRef }) {
	useAutoFitCamera(largeurTotaleCM, hauteurs, orbitRef);
	return null;
}

export function Scene({ children, largeurTotaleCM, hauteurs, orbitRef, onPointerMissed }) {
	return (
		<Canvas shadows camera={{ position: CAMERA_CONFIG.POSITION, fov: CAMERA_CONFIG.FOV }}>
			{/* Caméra automatique qui s'adapte aux dimensions */}
			<AutoFitCamera largeurTotaleCM={largeurTotaleCM} hauteurs={hauteurs} orbitRef={orbitRef} />

			{/* Éclairage ambiant (lumière douce générale) */}
			<ambientLight intensity={0.4} />

			{/* Lumière directionnelle (soleil) avec ombres */}
			<directionalLight position={[5, 10, 5]} intensity={0.8} color="#fffbeb" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />

			{/* Environment preset pour les réflexions réalistes */}
			<Environment preset="apartment" blur={0.5} />

			{/* Ombres de contact au sol */}
			<ContactShadows position={[0, 0, 0]} opacity={0.65} scale={20} blur={2.5} far={2} resolution={1024} color="#1e293b" />

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
