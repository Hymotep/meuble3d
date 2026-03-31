/**
 * ============================================================================
 * DRAGGABLE CAISSON COMPONENT
 * ============================================================================
 * Wrapper component that makes a cabinet draggable in the 3D scene.
 * (Logic is extracted to useCabinetDrag hook)
 */

import React, { useRef, useEffect } from "react";
import { useStore } from "../../store/store";

import { Caisson2 } from "../cabinet/CaissonCuisine";
import ArchitectureVisual from "../scene/ArchitectureVisual";
import { useCabinetDrag } from "../hooks/DraggableCaisson/useCabinetDrag";

const DraggableCaisson = ({ id, position, dimensions, type, config, isSelected, isClearanceViolated }) => {
	const meshRef = useRef();

	// Pour gérer les conflits de clearance au niveau global (store)
	const draggedId = useStore((s) => s.draggedId);

	// Toute la magie mathématique est cachée ici !
	const { bind, isColliding, localClearanceViolated, w, h, d, rotationRad, lastValidPos } = useCabinetDrag({
		id,
		meshRef,
		position,
		dimensions,
		type,
		config,
	});

	// CRUCIAL : Met à jour la position interne si store.js a forcé le déplacement (via AutoFitWall)
	useEffect(() => {
		lastValidPos.current = { x: position[0] / 1000, z: position[2] / 1000 };
		if (meshRef.current) {
			meshRef.current.position.set(position[0] / 1000, position[1] / 1000, position[2] / 1000);
		}
	}, [position[0], position[1], position[2], lastValidPos]);

	// On détermine si le meuble actuel viole les règles de dégagement
	const activeViolation = draggedId === id ? localClearanceViolated : isClearanceViolated;

	// Rendu 3D pur
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
