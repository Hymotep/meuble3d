/**
 * ============================================================================
 * KITCHEN SCENE COMPONENT
 * ============================================================================
 *
 * Main 3D scene for the kitchen configurator.
 * Contains:
 * - Lighting setup (ambient, directional, environment)
 * - Contact shadows for realism
 * - Grid for 2D view mode
 * - Room geometry
 * - All cabinet items
 * - Camera and controls configuration
 */

import React, { useMemo } from "react";
import { OrbitControls, Grid, PerspectiveCamera, OrthographicCamera, Environment, ContactShadows } from "@react-three/drei";
import { useStore } from "../store/store";
import { getClearanceBBox, doIntersect, getBBox } from "../utils/collision";
import RoomBuilder from "./RoomBuilder";
import DraggableCaisson from "./DraggableCaisson";

const KitchenScene = () => {
	const { room, items, selectedId, draggedId, viewMode } = useStore();

	// Calculate clearance violations for all items
	// This is memoized to avoid recalculating on every render
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

			{/* Ambient light for base illumination */}
			<ambientLight intensity={0.2} />

			{/* Directional light with warm tone */}
			<directionalLight position={[5, 10, 5]} intensity={0.6} color="#fefce8" />

			{/* Environment map for realistic reflections */}
			<Environment preset="apartment" blur={0.5} />

			{/* Contact shadows for grounded appearance */}
			{viewMode === "3D" && <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2} far={1.5} resolution={512} color="#000000" />}

			{/* ======================== */}
			{/* ROOM GEOMETRY */}
			{/* ======================== */}
			<RoomBuilder />

			{/* 2D Grid overlay */}
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

			{/* Perspective camera for 3D view */}
			<PerspectiveCamera makeDefault={viewMode === "3D"} position={[0, 2, 4]} fov={45} />

			{/* Orthographic camera for 2D top-down view */}
			<OrthographicCamera makeDefault={viewMode === "2D"} position={[0, 5, 0]} zoom={100} />

			{/* Orbit controls - disabled during drag */}
			<OrbitControls
				makeDefault
				enabled={!draggedId}
				enableRotate={viewMode === "3D"}
				minPolarAngle={0}
				maxPolarAngle={viewMode === "3D" ? Math.PI / 2 : 0}
			/>
		</>
	);
};

export default KitchenScene;
