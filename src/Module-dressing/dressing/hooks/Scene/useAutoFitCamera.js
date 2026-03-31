/**
 * ============================================================================
 * USE AUTO-FIT CAMERA HOOK
 * ============================================================================
 * Ce hook calcule la distance idéale et ajuste la caméra 3D pour que
 * tout le dressing soit visible dans le cadre, quelle que soit sa taille.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const useAutoFitCamera = (largeurTotaleCM, hauteurs, orbitRef) => {
	const { camera } = useThree();

	useEffect(() => {
		if (!orbitRef.current) return;

		const controls = orbitRef.current;
		const widthMeters = largeurTotaleCM / 100;
		const heightsArr = Object.values(hauteurs);

		// Hauteur max (par défaut 2m si vide)
		const maxHMeters = heightsArr.length > 0 ? Math.max(...heightsArr) / 100 : 2;
		const centerHeight = maxHMeters / 2;

		// Centrer la caméra sur le milieu du meuble
		controls.target.set(0, centerHeight, 0);

		// Mathématiques de trigonométrie pour le cadrage
		const fov = (camera.fov * Math.PI) / 180;
		const fitHeightDistance = maxHMeters / (2 * Math.tan(fov / 2));
		const fitWidthDistance = widthMeters / camera.aspect / (2 * Math.tan(fov / 2));

		// On prend la plus grande distance pour être sûr que tout rentre + une marge de 2m
		const idealDistance = Math.max(fitHeightDistance, fitWidthDistance) + 2.0;

		// Limites de zoom
		controls.minDistance = 1.0;
		controls.maxDistance = idealDistance + 1.0;

		// Application de la position via des coordonnées sphériques
		const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
		spherical.radius = idealDistance;

		camera.position.setFromSpherical(spherical).add(controls.target);
		controls.update();
	}, [largeurTotaleCM, hauteurs, camera, orbitRef]);
};
