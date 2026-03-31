/**
 * ============================================================================
 * ROOM BUILDER COMPONENT
 * ============================================================================
 *
 * Renders the 3D room geometry:
 * - Floor (Shape geometry for custom forms like L-shape)
 * - Walls (Using precise BoxGeometry math to avoid corner overlaps)
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStore } from "../../store/store";

const RoomBuilder = () => {
	const room = useStore((state) => state.room);
	const setSelectedId = useStore((state) => state.setSelectedId);

	const w = room.width / 1000;
	const d = room.depth / 1000;
	const h = room.height / 1000;

	// L'épaisseur de nos murs (10 cm)
	const t = 0.1;

	// --- CRÉATION DE LA FORME DU SOL ---
	const floorShape = useMemo(() => {
		const shape = new THREE.Shape();

		if (room.wallCount === 2) {
			// FORME EN L EXACTE
			shape.moveTo(-w / 2, d / 2);
			shape.lineTo(0, d / 2);
			shape.lineTo(0, 0);
			shape.lineTo(w / 2, 0);
			shape.lineTo(w / 2, -d / 2);
			shape.lineTo(-w / 2, -d / 2);
			shape.lineTo(-w / 2, d / 2);
		} else {
			// FORME RECTANGULAIRE CLASSIQUE
			shape.moveTo(-w / 2, d / 2);
			shape.lineTo(w / 2, d / 2);
			shape.lineTo(w / 2, -d / 2);
			shape.lineTo(-w / 2, -d / 2);
			shape.lineTo(-w / 2, d / 2);
		}
		return shape;
	}, [w, d, room.wallCount]);

	return (
		<group onPointerDown={() => setSelectedId(null)}>
			{/* --- LE SOL --- */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
				<shapeGeometry args={[floorShape]} />
				<meshStandardMaterial color="#e5e7eb" side={THREE.DoubleSide} />
			</mesh>

			{/* ========================================================== */}
			{/* 1. PIÈCE OUVERTE (1 seul mur au fond)                        */}
			{/* ========================================================== */}
			{room.wallCount === 1 && (
				<mesh position={[0, h / 2, -d / 2 - t / 2]}>
					<boxGeometry args={[w + t * 2, h, t]} />
					<meshStandardMaterial color={room.wallColor} />
				</mesh>
			)}

			{/* ========================================================== */}
			{/* 3. PIÈCE EN U / RECTANGULAIRE (3 murs)                       */}
			{/* ========================================================== */}
			{room.wallCount === 3 && (
				<group>
					{/* Mur du fond (Calculé pour s'insérer pile entre les deux autres) */}
					<mesh position={[0, h / 2, -d / 2 - t / 2]}>
						<boxGeometry args={[w, h, t]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>
					{/* Mur Gauche */}
					<mesh position={[-w / 2 - t / 2, h / 2, 0]}>
						<boxGeometry args={[t, h, d + t * 2]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>
					{/* Mur Droit */}
					<mesh position={[w / 2 + t / 2, h / 2, 0]}>
						<boxGeometry args={[t, h, d + t * 2]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>
				</group>
			)}

			{/* ========================================================== */}
			{/* 2. PIÈCE EN L (Assemblage parfait sans dépassement)          */}
			{/* ========================================================== */}
			{room.wallCount === 2 && (
				<group>
					{/* 1. Mur Gauche (Grand mur complet) */}
					<mesh position={[-w / 2 - t / 2, h / 2, 0]}>
						<boxGeometry args={[t, h, d + t * 2]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>

					{/* 2. Mur du fond gauche (s'arrête pile au coin pour couvrir l'angle) */}
					<mesh position={[-w / 4 + t / 2, h / 2, -d / 2 - t / 2]}>
						<boxGeometry args={[w / 2 + t, h, t]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>

					{/* 3. Mur intérieur qui revient vers l'avant (CORRIGÉ : ne dépasse plus !) */}
					<mesh position={[t / 2, h / 2, -d / 4]}>
						<boxGeometry args={[t, h, d / 2]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>

					{/* 4. Mur intérieur qui part vers la droite (CORRIGÉ : ne dépasse plus !) */}
					<mesh position={[w / 4 + t / 2, h / 2, -t / 2]}>
						<boxGeometry args={[w / 2 - t, h, t]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>

					{/* 5. Mur Droit extérieur */}
					<mesh position={[w / 2 + t / 2, h / 2, d / 4]}>
						<boxGeometry args={[t, h, d / 2 + t * 2]} />
						<meshStandardMaterial color={room.wallColor} />
					</mesh>
				</group>
			)}
		</group>
	);
};

export default RoomBuilder;
