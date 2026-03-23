/**
 * ============================================================================
 * ROOM BUILDER COMPONENT
 * ============================================================================
 *
 * Renders the 3D room geometry:
 * - Floor (always visible)
 * - Walls (configurable count: 1, 2, or 3)
 */

import React from "react";
import { useStore } from "../store/store";

const RoomBuilder = () => {
	const room = useStore((state) => state.room);
	const setSelectedId = useStore((state) => state.setSelectedId);

	const w = room.width / 1000;
	const d = room.depth / 1000;
	const h = room.height / 1000;

	return (
		<group onPointerDown={() => setSelectedId(null)}>
			{/* Floor */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]}>
				<planeGeometry args={[w, d]} />
				<meshStandardMaterial color="#e5e7eb" />
			</mesh>

			{/* Back wall */}
			{room.wallCount >= 1 && (
				<mesh position={[0, h / 2, -d / 2]}>
					<planeGeometry args={[w, h]} />
					<meshStandardMaterial color={room.wallColor} />
				</mesh>
			)}

			{/* Left wall */}
			{room.wallCount >= 2 && (
				<mesh rotation={[0, Math.PI / 2, 0]} position={[-w / 2, h / 2, 0]}>
					<planeGeometry args={[d, h]} />
					<meshStandardMaterial color={room.wallColor} />
				</mesh>
			)}

			{/* Right wall */}
			{room.wallCount === 3 && (
				<mesh rotation={[0, -Math.PI / 2, 0]} position={[w / 2, h / 2, 0]}>
					<planeGeometry args={[d, h]} />
					<meshStandardMaterial color={room.wallColor} />
				</mesh>
			)}
		</group>
	);
};

export default RoomBuilder;
