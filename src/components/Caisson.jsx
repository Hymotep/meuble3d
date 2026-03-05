import React, { useState, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// NOUVEAU : On réceptionne la prop 'profondeur'
export function Caisson({ largeur, hauteur, profondeur, activeConfig, isSelected, onClick, couleur, ...props }) {
	const { nodes } = useGLTF("/models/caisson.glb");

	const [isHovered, setIsHovered] = useState(false);
	const doorRef = useRef();
	const drawerRef = useRef();

	const BASE_WIDTH = 600;
	const BASE_HEIGHT = 812;
	const BASE_DEPTH = 600; // NOUVEAU : Profondeur d'origine
	const EPAISSEUR = 18;

	const customMaterial = useMemo(() => {
		return new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.8 });
	}, [couleur]);

	// --- CALCULS DES MULTIPLICATEURS ---
	const scaleX_horizontales = largeur / BASE_WIDTH;
	const scaleX_etagere = (largeur - EPAISSEUR * 2) / (BASE_WIDTH - EPAISSEUR * 2);

	const scaleZ_verticales = (hauteur - EPAISSEUR * 2) / (BASE_HEIGHT - EPAISSEUR * 2);
	const scaleZ_fond = hauteur / BASE_HEIGHT;

	// NOUVEAU : Calculs pour la profondeur
	const scaleY_profondeur = profondeur / BASE_DEPTH;
	const deltaY = profondeur - BASE_DEPTH;

	// Tiroirs (largeur X)
	const deltaX = largeur - BASE_WIDTH;
	const scaleX_tiroir_face = (554 + deltaX) / 554;
	const scaleX_tiroir_fond = (518 + deltaX) / 518;

	// Tiroirs (profondeur Y)
	const scaleY_tiroir_prof = (569.67 + deltaY) / 569.67;

	useFrame(() => {
		if (doorRef.current) {
			const targetRotation = isHovered && (activeConfig === 3 || activeConfig === 4) ? -Math.PI / 2 : 0;
			doorRef.current.rotation.z = THREE.MathUtils.lerp(doorRef.current.rotation.z, targetRotation, 0.1);
		}
		if (drawerRef.current) {
			const targetPosition = isHovered && (activeConfig === 1 || activeConfig === 4) ? -300 : 0;
			drawerRef.current.position.y = THREE.MathUtils.lerp(drawerRef.current.position.y, targetPosition, 0.1);
		}
	});

	// --- L'USINE À ÉTAGÈRES ---
	const renderEtagere = (hauteurZ, key) => (
		<mesh
			key={key}
			geometry={nodes.Geom3D_étagère_1.geometry}
			material={customMaterial}
			position={[EPAISSEUR, 0, hauteurZ]}
			// NOUVEAU : On applique l'étirement sur l'axe Y (le chiffre du milieu)
			scale={[25.4 * scaleX_etagere, 25.4 * scaleY_profondeur, 25.4]}
		/>
	);

	// --- LE BLOC TIROIR ---
	const renderTiroirs = () => (
		<group ref={drawerRef}>
			<mesh
				geometry={nodes.Geom3D_tiroir_gauche.geometry}
				material={customMaterial}
				position={[23.875, 15.67, 53.615]}
				scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4]}
			/>
			<mesh
				geometry={nodes.Geom3D_tiroir_droit.geometry}
				material={customMaterial}
				position={[559.875 + deltaX, 15.67, 53.615]}
				scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4]}
			/>
			<mesh
				geometry={nodes.Geom3D_tiroir_face.geometry}
				material={customMaterial}
				position={[23.875, -2.33, 35.615]}
				scale={[25.4 * scaleX_tiroir_face, 25.4, 25.4]}
			/>
			<mesh
				geometry={nodes.Geom3D_tiroir_fond.geometry}
				material={customMaterial}
				position={[41.875, 569.67 + deltaY, 53.615]}
				scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4]}
			/>
			<mesh
				geometry={nodes.Geom3D_tiroir_bas.geometry}
				material={customMaterial}
				position={[1023.032 + deltaX * 1.87, 118.07 + deltaY * 0.207, 0]}
				scale={[25.4 * scaleX_tiroir_fond, 25.4 * scaleY_tiroir_prof, 25.4]}
			/>{" "}
		</group>
	);

	return (
		<group
			{...props}
			dispose={null}
			onClick={onClick}
			onPointerOver={(e) => {
				e.stopPropagation();
				setIsHovered(true);
			}}
			onPointerOut={(e) => {
				e.stopPropagation();
				setIsHovered(false);
			}}
		>
			<group rotation={[-Math.PI / 2, 0, 0]}>
				<group scale={0.001}>
					{/* --- CAISSON DE BASE --- */}
					{/* NOUVEAU : Ajout du scaleY_profondeur pour étirer les planches de côté et le haut/bas */}
					<mesh
						geometry={nodes.Geom3D_traversse_bas.geometry}
						material={customMaterial}
						scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]}
					/>
					<mesh
						geometry={nodes.Geom3D_montant_droit.geometry}
						material={customMaterial}
						position={[0, 0, EPAISSEUR]}
						scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]}
					/>
					<mesh
						geometry={nodes.Geom3D_montant_gauche.geometry}
						material={customMaterial}
						position={[largeur - EPAISSEUR, 0, EPAISSEUR]}
						scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]}
					/>
					<mesh
						geometry={nodes.Geom3D_traverse_haut.geometry}
						material={customMaterial}
						position={[0, 0, hauteur - EPAISSEUR]}
						scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]}
					/>
					<mesh
						geometry={nodes.Geom3D_fond_arrière.geometry}
						material={customMaterial}
						position={[0, profondeur, 0]}
						scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]}
					/>

					{activeConfig === 0 && renderEtagere(hauteur / 2, "etagere-centre")}
					{activeConfig === 1 && (
						<group>
							{" "}
							{renderTiroirs()} {renderEtagere(hauteur - 300, "etagere-haute")}{" "}
						</group>
					)}
					{activeConfig === 2 && <group> {[1, 2, 3, 4].map((i) => renderEtagere((hauteur / 5) * i, `etagere-biblio-${i}`))} </group>}

					{activeConfig === 3 && (
						<group>
							{renderEtagere(hauteur / 2, "etagere-cachee")}
							<mesh
								ref={doorRef}
								geometry={nodes.Geom3D_porte.geometry}
								material={customMaterial}
								position={[0, -18, 0]}
								scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]}
							/>
						</group>
					)}

					{activeConfig === 4 && (
						<group>
							{renderTiroirs()}
							<mesh
								ref={doorRef}
								geometry={nodes.Geom3D_porte.geometry}
								material={customMaterial}
								position={[0, -18, 280]}
								scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond * 0.65]}
							/>
						</group>
					)}

					{/* --- LE SELECTEUR ROUGE TYLKO --- */}
					{isSelected && (
						<mesh position={[largeur / 2, profondeur / 2, hauteur / 2]}>
							<boxGeometry args={[largeur + 4, profondeur + 4, hauteur + 4]} />
							<meshBasicMaterial color="#ff4a36" transparent opacity={0.3} depthWrite={false} />
						</mesh>
					)}
				</group>
			</group>
		</group>
	);
}

useGLTF.preload("/models/caisson.glb");
