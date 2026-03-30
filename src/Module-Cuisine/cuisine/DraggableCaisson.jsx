/**
 * ============================================================================
 * DRAGGABLE CAISSON COMPONENT
 * ============================================================================
 * Wrapper component that makes a cabinet draggable in the 3D scene.
 */

import React, { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useStore } from "../store/store";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

import { Caisson2 } from "./Caisson2";
import ArchitectureVisual from "./ArchitectureVisual";
import { getBBox, getClearanceBBox, doIntersect } from "../utils/collision";
import { SNAP_DISTANCE } from "../utils/constants";

const DraggableCaisson = ({ id, position, dimensions, type, config, isSelected, isClearanceViolated }) => {
	const meshRef = useRef();
	const { camera, controls } = useThree();

	const items = useStore((s) => s.items);
	const room = useStore((s) => s.room);
	const setSelectedId = useStore((s) => s.setSelectedId);
	const setDraggedId = useStore((s) => s.setDraggedId);
	const updateItemPosition = useStore((s) => s.updateItemPosition);

	const [isColliding, setIsColliding] = useState(false);
	const [localClearanceViolated, setLocalClearanceViolated] = useState(false);
	const lastValidPos = useRef({ x: position[0] / 1000, z: position[2] / 1000 });

	// CRUCIAL : Met à jour la position interne si store.js a forcé le déplacement (via AutoFitWall)
	useEffect(() => {
		lastValidPos.current = { x: position[0] / 1000, z: position[2] / 1000 };
		if (meshRef.current) {
			meshRef.current.position.set(position[0] / 1000, position[1] / 1000, position[2] / 1000);
		}
	}, [position[0], position[1], position[2]]);

	const currentItem = items.find((i) => i.id === id);
	const rotationDeg = currentItem?.rotation || 0;
	const rotationRad = -(rotationDeg * Math.PI) / 180;

	const w = dimensions.width / 1000;
	const h = dimensions.height / 1000;
	const d = dimensions.depth / 1000;

	const isRotated = rotationDeg === 90 || rotationDeg === 270;
	const worldW = isRotated ? d : w;
	const worldD = isRotated ? w : d;

	let baseY = 0;
	if (type === "wall_cabinet") baseY = 1.4;
	if (type === "window") baseY = 0.9;

	const bind = useDrag(({ active, first, last, event, memo }) => {
		const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
		raycaster.setFromCamera(mouse, camera);
		const intersectPoint = new THREE.Vector3();
		raycaster.ray.intersectPlane(floorPlane, intersectPoint);

		if (first) {
			event.stopPropagation();
			setSelectedId(id);
			setDraggedId(id);
			if (controls) controls.enabled = false;
			return { offsetX: intersectPoint.x - meshRef.current.position.x, offsetZ: intersectPoint.z - meshRef.current.position.z };
		}

		if (active && meshRef.current) {
			let newX = intersectPoint.x - memo.offsetX;
			let newZ = intersectPoint.z - memo.offsetZ;

			const roomW = room.width / 1000;
			const roomD = room.depth / 1000;
			const limitLeft = -roomW / 2 + worldW / 2;
			const limitRight = roomW / 2 - worldW / 2;
			const limitBack = -roomD / 2 + worldD / 2;
			const limitFront = roomD / 2 - worldD / 2;

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

			newX = Math.max(limitLeft, Math.min(limitRight, newX));
			newZ = Math.max(limitBack, Math.min(limitFront, newZ));

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

				const oBBox = getBBox(other);
				if (other.config?.equipement === "oven_microwave" || other.config?.isTiroirsInterieurs) {
					if (doIntersect(myBBoxLocal, getClearanceBBox(other))) hasClearanceIssue = true;
				}
				if (iNeedClearance && doIntersect(myClearance, oBBox)) hasClearanceIssue = true;
			});

			setIsColliding(hasCollision);
			setLocalClearanceViolated(hasClearanceIssue);

			if (hasCollision) {
				newX = lastValidPos.current.x;
				newZ = lastValidPos.current.z;
			} else {
				lastValidPos.current = { x: newX, z: newZ };
			}

			meshRef.current.position.set(newX, baseY, newZ);
		}

		if (last) {
			setDraggedId(null);
			setLocalClearanceViolated(false);
			if (controls) controls.enabled = true;
			updateItemPosition(id, [meshRef.current.position.x * 1000, baseY * 1000, meshRef.current.position.z * 1000]);
			setIsColliding(false);
		}
		return memo;
	});

	const activeViolation = useStore((s) => s.draggedId) === id ? localClearanceViolated : isClearanceViolated;

	return (
		<group ref={meshRef} {...bind()} position={[position[0] / 1000, position[1] / 1000, position[2] / 1000]} rotation={[0, rotationRad, 0]}>
			<group position={[-w / 2, 0, -d / 2]}>
				{type === "window" ? (
					<ArchitectureVisual w={w} h={h} d={d} isSelected={isSelected} isColliding={isColliding} />
				) : (
					<Caisson2
						largeur={dimensions.width}
						hauteur={dimensions.height}
						profondeur={dimensions.depth}
						isSelected={isSelected}
						isColliding={isColliding}
						type={type}
						couleurExt={config.couleurExt}
						couleurInt={config.couleurInt}
						avecPoignees={config.avecPoignees}
						couleurPoignees={config.couleurPoignees}
						isTiroirsInterieurs={config.isTiroirsInterieurs}
						equipement={config.equipement}
						couleurPlanTravail={config.couleurPlanTravail}
						isClearanceViolated={activeViolation}
						useTextures={config.useTextures}
					/>
				)}
			</group>
		</group>
	);
};

export default DraggableCaisson;
