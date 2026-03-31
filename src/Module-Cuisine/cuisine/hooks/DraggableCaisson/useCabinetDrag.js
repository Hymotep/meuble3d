/**
 * ============================================================================
 * USE CABINET DRAG HOOK
 * ============================================================================
 * Ce hook encapsule toute la logique mathématique du déplacement 3D :
 * - Raycasting (détection de la souris sur le sol)
 * - Contraintes de la pièce (Clamp)
 * - Magnétisme (Snapping)
 * - Détection des collisions (AABB)
 */

import { useState, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { useStore } from "../../../store/store";
import { getBBox, getClearanceBBox, doIntersect } from "../../../utils/collision"; // Ajuste le chemin
import { SNAP_DISTANCE } from "../../../utils/constants";

export const useCabinetDrag = ({ id, meshRef, position, dimensions, type, config }) => {
	const { camera, controls } = useThree();

	// Accès au store Zustand
	const items = useStore((s) => s.items);
	const room = useStore((s) => s.room);
	const setSelectedId = useStore((s) => s.setSelectedId);
	const setDraggedId = useStore((s) => s.setDraggedId);
	const updateItemPosition = useStore((s) => s.updateItemPosition);

	// États locaux
	const [isColliding, setIsColliding] = useState(false);
	const [localClearanceViolated, setLocalClearanceViolated] = useState(false);

	// Référence pour garder la dernière position valide (sans collision)
	const lastValidPos = useRef({ x: position[0] / 1000, z: position[2] / 1000 });

	// Calculs de base
	const currentItem = items.find((i) => i.id === id);
	const rotationDeg = currentItem?.rotation || 0;

	const w = dimensions.width / 1000;
	const h = dimensions.height / 1000;
	const d = dimensions.depth / 1000;

	const isRotated = rotationDeg === 90 || rotationDeg === 270;
	const worldW = isRotated ? d : w;
	const worldD = isRotated ? w : d;

	let baseY = 0;
	if (type === "wall_cabinet") baseY = 1.4;
	if (type === "window") baseY = 0.9;

	// Le moteur de Drag
	const bind = useDrag(({ active, first, last, event, memo }) => {
		// 1. Mise en place du Raycaster (détecter où pointe la souris sur le sol 3D)
		const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
		raycaster.setFromCamera(mouse, camera);
		const intersectPoint = new THREE.Vector3();
		raycaster.ray.intersectPlane(floorPlane, intersectPoint);

		// --- DEBUT DU DRAG ---
		if (first) {
			event.stopPropagation();
			setSelectedId(id);
			setDraggedId(id);
			if (controls) controls.enabled = false;

			// On mémorise l'écart entre le centre du meuble et le clic de la souris
			return {
				offsetX: intersectPoint.x - meshRef.current.position.x,
				offsetZ: intersectPoint.z - meshRef.current.position.z,
			};
		}

		// --- PENDANT LE DRAG ---
		if (active && meshRef.current) {
			// Position brute demandée par la souris
			let newX = intersectPoint.x - memo.offsetX;
			let newZ = intersectPoint.z - memo.offsetZ;

			// 2. Contraintes de la pièce (Murs)
			const roomW = room.width / 1000;
			const roomD = room.depth / 1000;
			const limitLeft = -roomW / 2 + worldW / 2;
			const limitRight = roomW / 2 - worldW / 2;
			const limitBack = -roomD / 2 + worldD / 2;
			const limitFront = roomD / 2 - worldD / 2;

			// Logique de Snapping (Magnétisme aux murs)
			if (type === "window") {
				const distLeft = Math.abs(newX - limitLeft);
				const distRight = Math.abs(newX - limitRight);
				const distBack = Math.abs(newZ - limitBack);
				const distFront = Math.abs(newZ - limitFront);
				const minDist = Math.min(distLeft, distRight, distBack, distFront);

				if (minDist === distLeft) newX = limitLeft;
				else if (minDist === distRight) newX = limitRight;
				else if (minDist === distBack) newZ = limitBack;
				else if (minDist === distFront) newZ = limitFront;
			} else {
				if (Math.abs(newX - limitLeft) < SNAP_DISTANCE) newX = limitLeft;
				if (Math.abs(newX - limitRight) < SNAP_DISTANCE) newX = limitRight;
				if (Math.abs(newZ - limitBack) < SNAP_DISTANCE) newZ = limitBack;
				if (Math.abs(newZ - limitFront) < SNAP_DISTANCE) newZ = limitFront;
			}

			// On empêche de sortir de la pièce (Clamp)
			newX = Math.max(limitLeft, Math.min(limitRight, newX));
			newZ = Math.max(limitBack, Math.min(limitFront, newZ));

			// 3. Détection des collisions avec les autres meubles
			const otherItems = items.filter((i) => i.id !== id);
			let hasCollision = false;
			let hasClearanceIssue = false;

			const myBBoxLocal = getBBox(currentItem, newX, newZ);
			const iNeedClearance = config.equipement === "oven_microwave" || config.isTiroirsInterieurs;
			const myClearance = iNeedClearance ? getClearanceBBox(currentItem, newX, newZ) : null;

			otherItems.forEach((other) => {
				if (type === "window" || other.type === "window") return;

				const otherRot = other.rotation || 0;
				const otherIsRot = otherRot === 90 || otherRot === 270;
				const oW = (otherIsRot ? other.dimensions.depth : other.dimensions.width) / 1000;
				const oD = (otherIsRot ? other.dimensions.width : other.dimensions.depth) / 1000;
				const oX = other.position[0] / 1000;
				const oZ = other.position[2] / 1000;
				const oY = other.position[1] / 1000;
				const oH = other.dimensions.height / 1000;

				// Magnétisme avec les autres meubles
				if (Math.abs(newZ - oZ) < 0.1 && Math.abs(baseY - oY) < 0.1) {
					const targetRight = oX + oW / 2 + worldW / 2;
					if (Math.abs(newX - targetRight) < SNAP_DISTANCE) {
						newX = targetRight;
						newZ = oZ;
					}
					const targetLeft = oX - oW / 2 - worldW / 2;
					if (Math.abs(newX - targetLeft) < SNAP_DISTANCE) {
						newX = targetLeft;
						newZ = oZ;
					}
				}

				// Calcul de l'intersection physique (AABB)
				const isPerp =
					Math.abs((rotationDeg % 180) - (otherRot % 180)) === 90 &&
					(type === "base_cabinet" || type === "tall_cabinet") &&
					(other.type === "base_cabinet" || other.type === "tall_cabinet");
				const gap = isPerp ? 0.05 : -0.005;

				const myMinX = newX - worldW / 2;
				const myMaxX = newX + worldW / 2;
				const myMinY = baseY;
				const myMaxY = baseY + h;
				const myMinZ = newZ - worldD / 2;
				const myMaxZ = newZ + worldD / 2;

				const oMinX = oX - oW / 2;
				const oMaxX = oX + oW / 2;
				const oMinY = oY;
				const oMaxY = oY + oH;
				const oMinZ = oZ - oD / 2;
				const oMaxZ = oZ + oD / 2;

				const intersectX = myMinX < oMaxX + gap && myMaxX > oMinX - gap;
				const intersectY = myMinY < oMaxY - 0.005 && myMaxY > oMinY + 0.005;
				const intersectZ = myMinZ < oMaxZ + gap && myMaxZ > oMinZ - gap;

				if (intersectX && intersectY && intersectZ) hasCollision = true;

				// Zones de dégagement (Clearance)
				const oBBox = getBBox(other);
				if (other.config?.equipement === "oven_microwave" || other.config?.isTiroirsInterieurs) {
					if (doIntersect(myBBoxLocal, getClearanceBBox(other))) hasClearanceIssue = true;
				}
				if (iNeedClearance && doIntersect(myClearance, oBBox)) hasClearanceIssue = true;
			});

			setIsColliding(hasCollision);
			setLocalClearanceViolated(hasClearanceIssue);

			// 4. Application de la position
			if (hasCollision) {
				// Si collision, on bloque le meuble à sa dernière position valide
				newX = lastValidPos.current.x;
				newZ = lastValidPos.current.z;
			} else {
				// Sinon on sauvegarde cette position comme valide
				lastValidPos.current = { x: newX, z: newZ };
			}

			meshRef.current.position.set(newX, baseY, newZ);
		}

		// --- FIN DU DRAG ---
		if (last) {
			setDraggedId(null);
			setLocalClearanceViolated(false);
			if (controls) controls.enabled = true;

			// On sauvegarde la position finale dans Zustand (conversion en millimètres)
			updateItemPosition(id, [meshRef.current.position.x * 1000, baseY * 1000, meshRef.current.position.z * 1000]);
			setIsColliding(false);
		}

		return memo;
	});

	// Retourner ce dont le composant React a besoin
	return {
		bind,
		isColliding,
		localClearanceViolated,
		w,
		h,
		d,
		rotationRad: -(rotationDeg * Math.PI) / 180,
		lastValidPos,
	};
};
