import React from "react";

export const Dishwasher = ({ largeur = 600, hauteur = 812, profondeur = 600 }) => {
	const w = largeur / 1000;
	const h = hauteur / 1000;
	const d = profondeur / 1000;

	const panelHeight = 0.12;
	// On fait descendre la porte jusqu'en bas puisqu'il n'y a plus de plinthe
	const doorHeight = h - panelHeight - 0.01;
	const facadeThickness = 0.02;

	const frontZ = d / 2 - facadeThickness / 2;

	return (
		<group>
			{/* --- BANDEAU DE CONTRÔLE --- */}
			<mesh position={[0, h / 2 - panelHeight / 2, frontZ]}>
				<boxGeometry args={[w - 0.004, panelHeight - 0.004, facadeThickness]} />
				<meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.2} />
			</mesh>

			{/* --- ÉCRAN DIGITAL --- */}
			<mesh position={[0, h / 2 - panelHeight / 2, frontZ + facadeThickness / 2 + 0.001]}>
				<planeGeometry args={[0.08, 0.04]} />
				<meshBasicMaterial color="#0ea5e9" />
			</mesh>

			{/* --- BOUTONS --- */}
			<mesh position={[w / 2 - 0.05, h / 2 - panelHeight / 2, frontZ + facadeThickness / 2 + 0.002]}>
				<circleGeometry args={[0.012, 16]} />
				<meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
			</mesh>
			<mesh position={[w / 2 - 0.09, h / 2 - panelHeight / 2, frontZ + facadeThickness / 2 + 0.002]}>
				<circleGeometry args={[0.012, 16]} />
				<meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
			</mesh>

			{/* --- POIGNÉE CREUSÉE --- */}
			<mesh position={[0, h / 2 - panelHeight + 0.015, frontZ + facadeThickness / 2 + 0.002]}>
				<boxGeometry args={[w * 0.4, 0.02, 0.005]} />
				<meshStandardMaterial color="#111827" roughness={0.8} />
			</mesh>

			{/* --- PORTE PRINCIPALE (Descend jusqu'au sol) --- */}
			<mesh position={[0, -panelHeight / 2 + 0.005, frontZ]}>
				<boxGeometry args={[w - 0.004, doorHeight, facadeThickness]} />
				<meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
			</mesh>

			{/* --- CORPS INTÉRIEUR --- */}
			<mesh position={[0, 0, -facadeThickness / 2]}>
				<boxGeometry args={[w - 0.01, h - 0.01, d - facadeThickness]} />
				<meshStandardMaterial color="#e5e7eb" metalness={0.1} roughness={0.7} />
			</mesh>
		</group>
	);
};

export default Dishwasher;
