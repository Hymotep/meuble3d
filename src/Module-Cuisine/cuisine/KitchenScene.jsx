/**
 * ============================================================================
 * KITCHEN SCENE COMPONENT
 * ============================================================================
 */

import React, { useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber"; // <-- L'IMPORT MANQUANT ÉTAIT LÀ !
import { OrbitControls, Grid, PerspectiveCamera, OrthographicCamera, Environment, ContactShadows } from "@react-three/drei";
import { useStore } from "../store/store";
import { getClearanceBBox, doIntersect, getBBox } from "../utils/KitchenScene/collision";
import RoomBuilder from "./RoomBuilder";
import DraggableCaisson from "./DraggableCaisson";

// --- GESTIONNAIRE DE CAMÉRA (Zoom, Dézoom, Centrage depuis l'interface) ---
const CameraHandler = () => {
	const cameraAction = useStore((s) => s.cameraAction);
	const triggerCameraAction = useStore((s) => s.triggerCameraAction);
	const viewMode = useStore((s) => s.viewMode);
	const { camera, controls } = useThree();

	useEffect(() => {
		if (!cameraAction) return;

		if (cameraAction === "zoomIn") {
			if (viewMode === "2D") {
				camera.zoom *= 1.2;
				camera.updateProjectionMatrix();
			} else {
				camera.translateZ(-0.8);
			}
		}
		if (cameraAction === "zoomOut") {
			if (viewMode === "2D") {
				camera.zoom /= 1.2;
				camera.updateProjectionMatrix();
			} else {
				camera.translateZ(0.8);
			}
		}
		if (cameraAction === "center") {
			if (viewMode === "2D") {
				camera.position.set(0, 5, 0);
				camera.zoom = 100;
				camera.updateProjectionMatrix();
			} else {
				camera.position.set(0, 2, 4);
			}
			if (controls) {
				controls.target.set(0, 0, 0);
				controls.update();
			}
		}

		// On réinitialise l'action pour pouvoir recliquer
		triggerCameraAction(null);
	}, [cameraAction, camera, viewMode, triggerCameraAction, controls]);

	return null;
};

const KitchenScene = () => {
	const { room, items, selectedId, draggedId, viewMode } = useStore();

	// Calculate clearance violations for all items
	const clearanceViolations = useMemo(() => {
		const violations = new Set();

		items.forEach((item) => {
			const needsClearance = item.config?.equipement === "oven_microwave" || item.config?.isTiroirsInterieurs;

			if (needsClearance) {
				const clearanceBox = getClearanceBBox(item);

				items.forEach((other) => {
					if (item.id === other.id) return;
					if (other.type === "window") return;

					const otherBox = getBBox(other);
					if (doIntersect(clearanceBox, otherBox)) {
						violations.add(item.id);
						violations.add(other.id);
					}
				});
			}
		});

		return violations;
	}, [items]);

	return (
		<>
			{/* ======================== */}
			{/* LIGHTING SETUP */}
			{/* ======================== */}
			<ambientLight intensity={0.2} />
			<directionalLight position={[5, 10, 5]} intensity={0.6} color="#fefce8" />
			<Environment preset="apartment" blur={0.5} />
			{viewMode === "3D" && <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} resolution={512} color="#000000" />}

			{/* ======================== */}
			{/* ROOM GEOMETRY */}
			{/* ======================== */}
			<RoomBuilder />
			{viewMode === "2D" && <Grid args={[room.width / 1000, room.depth / 1000]} infiniteGrid fadeDistance={10} />}

			{/* ======================== */}
			{/* CABINET ITEMS */}
			{/* ======================== */}
			{items.map((item) => (
				<DraggableCaisson
					key={item.id}
					id={item.id}
					type={item.type}
					position={item.position}
					dimensions={item.dimensions}
					isSelected={selectedId === item.id}
					config={item.config}
					isClearanceViolated={clearanceViolations.has(item.id)}
				/>
			))}

			{/* ======================== */}
			{/* CAMERA CONFIGURATION */}
			{/* ======================== */}
			<PerspectiveCamera makeDefault={viewMode === "3D"} position={[0, 2, 4]} fov={45} />
			<OrthographicCamera makeDefault={viewMode === "2D"} position={[0, 5, 0]} zoom={100} />

			{/* Contrôles de la souris */}
			<OrbitControls
				makeDefault
				enabled={!draggedId}
				enableRotate={viewMode === "3D"}
				minPolarAngle={0}
				maxPolarAngle={viewMode === "3D" ? Math.PI / 2 : 0}
			/>

			{/* Notre nouveau contrôleur de boutons de zoom */}
			<CameraHandler />
		</>
	);
};

export default KitchenScene;
