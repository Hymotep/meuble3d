import React, { useState, useRef, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Caisson({
	largeur,
	hauteur,
	profondeur,
	activeConfig,
	isSelected,
	onClick,
	finitionExt,
	couleurExt,
	finitionInt,
	couleurInt,
	avecPoignees,
	couleurPoignees,
	isTiroirsInterieurs,
	isRightHinge,
	...props
}) {
	const { nodes } = useGLTF("/models/caisson.glb");

	const [colorMap, normalMap, roughnessMap] = useTexture([
		"/textures/oak/chene_color.jpg",
		"/textures/oak/chene_normal.jpg",
		"/textures/oak/chene_roughness.jpg",
	]);

	useMemo(() => {
		colorMap.colorSpace = THREE.SRGBColorSpace;
	}, [colorMap]);

	const [isHovered, setIsHovered] = useState(false);
	const leftDoorRef = useRef();
	const rightDoorRef = useRef();
	const drawerRef = useRef();

	const BASE_WIDTH = 600;
	const BASE_HEIGHT = 812;
	const BASE_DEPTH = 600;
	const EPAISSEUR = 18;

	const matExt = useMemo(() => {
		const isOak = finitionExt === "Chêne";
		return new THREE.MeshStandardMaterial({
			color: isOak ? "#ffffff" : couleurExt,
			map: isOak ? colorMap : null,
			normalMap: isOak ? normalMap : null,
			roughnessMap: isOak ? roughnessMap : null,
			roughness: isOak ? 1 : 0.8,
			side: THREE.DoubleSide,
		});
	}, [finitionExt, couleurExt, colorMap, normalMap, roughnessMap]);

	const matInt = useMemo(() => {
		const isOak = finitionInt === "Chêne";
		return new THREE.MeshStandardMaterial({
			color: isOak ? "#ffffff" : couleurInt,
			map: isOak ? colorMap : null,
			normalMap: isOak ? normalMap : null,
			roughnessMap: isOak ? roughnessMap : null,
			roughness: isOak ? 1 : 0.8,
			side: THREE.DoubleSide,
		});
	}, [finitionInt, couleurInt, colorMap, normalMap, roughnessMap]);

	const scaleX_horizontales = largeur / BASE_WIDTH;
	const scaleX_etagere = (largeur - EPAISSEUR * 2) / (BASE_WIDTH - EPAISSEUR * 2);
	const scaleZ_verticales = (hauteur - EPAISSEUR * 2) / (BASE_HEIGHT - EPAISSEUR * 2);
	const scaleZ_fond = hauteur / BASE_HEIGHT;
	const scaleY_profondeur = profondeur / BASE_DEPTH;
	const deltaY = profondeur - BASE_DEPTH;

	const deltaX = largeur - BASE_WIDTH;
	const scaleX_tiroir_face = (554 + deltaX) / 554;
	const scaleX_tiroir_fond = (518 + deltaX) / 518;
	const scaleY_tiroir_prof = (569.67 + deltaY) / 569.67;

	const HAUTEUR_BLOC_TIROIR = 300;
	const HAUTEUR_PORTE_ORIGINE = BASE_HEIGHT - EPAISSEUR;
	const espaceLibrePourPorte = hauteur - HAUTEUR_BLOC_TIROIR - EPAISSEUR;
	const scaleZ_demi_porte = espaceLibrePourPorte / HAUTEUR_PORTE_ORIGINE;

	let nbTiroirs = 2;
	if (activeConfig === 6 || activeConfig === 8) nbTiroirs = 3;
	if (activeConfig === 7) nbTiroirs = 4;

	const HAUTEUR_TIROIR_ORIGINE = 200;
	const hauteurUnTiroir = HAUTEUR_BLOC_TIROIR / nbTiroirs;
	const scaleZ_tiroir = hauteurUnTiroir / HAUTEUR_TIROIR_ORIGINE;

	const hasDrawers = [1, 4, 6, 7, 8].includes(activeConfig);

	useFrame(() => {
		const angleDeBase = Math.PI / 2.5;
		const angleOuvert = Math.PI / 2;

		if (leftDoorRef.current) {
			const targetRotationLeft = isHovered ? -angleOuvert : -angleDeBase;
			leftDoorRef.current.rotation.z = THREE.MathUtils.lerp(leftDoorRef.current.rotation.z, targetRotationLeft, 0.1);
		}
		if (rightDoorRef.current) {
			const targetRotationRight = isHovered ? angleOuvert : angleDeBase;
			rightDoorRef.current.rotation.z = THREE.MathUtils.lerp(rightDoorRef.current.rotation.z, targetRotationRight, 0.1);
		}

		if (drawerRef.current) {
			const baseDrawerY = isTiroirsInterieurs ? 20 : 0;
			const targetPosition = isHovered && hasDrawers ? -300 : baseDrawerY;
			drawerRef.current.position.y = THREE.MathUtils.lerp(drawerRef.current.position.y, targetPosition, 0.1);
		}
	});

	const renderPoignee = (doorWidth, doorHeight) => {
		if (!avecPoignees) return null;

		const posX = doorWidth - 30;
		const posY = -15;
		const posZ = doorHeight / 2;

		return (
			<mesh position={[posX, posY, posZ]}>
				<boxGeometry args={[12, 20, 150]} />
				<meshStandardMaterial color={couleurPoignees} metalness={0.6} roughness={0.3} />
			</mesh>
		);
	};

	const renderPortes = (zOffset, scaleZ) => {
		const doorHeight = HAUTEUR_PORTE_ORIGINE * scaleZ;

		if (largeur >= 700) {
			const doorWidth = largeur / 2;
			const scaleXLeft = (25.4 * scaleX_horizontales) / 2;
			const scaleXRight = -((25.4 * scaleX_horizontales) / 2);

			return (
				<group>
					{/* PORTE GAUCHE */}
					<mesh
						ref={leftDoorRef}
						geometry={nodes.Geom3D_porte.geometry}
						material={matExt}
						position={[0, -18, zOffset]}
						scale={[scaleXLeft, 25.4, 25.4 * scaleZ]}
					>
						{/* On annule localement l'échelle pour que la poignée garde sa taille normale */}
						<group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZ)]}>{renderPoignee(doorWidth, doorHeight)}</group>
					</mesh>

					{/* PORTE DROITE */}
					<mesh
						ref={rightDoorRef}
						geometry={nodes.Geom3D_porte.geometry}
						material={matExt}
						position={[largeur, -18, zOffset]}
						scale={[scaleXRight, 25.4, 25.4 * scaleZ]}
					>
						<group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZ)]}>{renderPoignee(doorWidth, doorHeight)}</group>
					</mesh>
				</group>
			);
		} else {
			const doorWidth = largeur;
			if (isRightHinge) {
				const scaleXRight = -(25.4 * scaleX_horizontales);
				return (
					<mesh
						ref={rightDoorRef}
						geometry={nodes.Geom3D_porte.geometry}
						material={matExt}
						position={[largeur, -18, zOffset]}
						scale={[scaleXRight, 25.4, 25.4 * scaleZ]}
					>
						<group scale={[1 / Math.abs(scaleXRight), 1 / 25.4, 1 / (25.4 * scaleZ)]}>{renderPoignee(doorWidth, doorHeight)}</group>
					</mesh>
				);
			} else {
				const scaleXLeft = 25.4 * scaleX_horizontales;
				return (
					<mesh
						ref={leftDoorRef}
						geometry={nodes.Geom3D_porte.geometry}
						material={matExt}
						position={[0, -18, zOffset]}
						scale={[scaleXLeft, 25.4, 25.4 * scaleZ]}
					>
						<group scale={[1 / Math.abs(scaleXLeft), 1 / 25.4, 1 / (25.4 * scaleZ)]}>{renderPoignee(doorWidth, doorHeight)}</group>
					</mesh>
				);
			}
		}
	};

	const renderEtagere = (hauteurZ, key) => (
		<mesh
			key={key}
			geometry={nodes.Geom3D_étagère_1.geometry}
			material={matInt}
			position={[EPAISSEUR, 0, hauteurZ]}
			scale={[25.4 * scaleX_etagere, 25.4 * scaleY_profondeur, 25.4]}
		/>
	);

	const renderPenderie = (hauteurEtagere, key) => {
		const longueurBarre = largeur - EPAISSEUR * 2;
		return (
			<mesh key={key} position={[largeur / 2, profondeur / 2, hauteurEtagere - 40]} rotation={[0, 0, Math.PI / 2]}>
				<cylinderGeometry args={[12, 12, longueurBarre, 32]} />
				<meshStandardMaterial color="#d0d4d8" metalness={0.9} roughness={0.15} />
			</mesh>
		);
	};

	const renderTiroirs = () => {
		const tiroirsGeneres = [];
		const facadeMaterial = isTiroirsInterieurs ? matInt : matExt;

		for (let i = 0; i < nbTiroirs; i++) {
			const zOffset = i * hauteurUnTiroir;
			tiroirsGeneres.push(
				<group key={i} position={[0, 0, zOffset]}>
					<mesh
						geometry={nodes.Geom3D_tiroir_gauche.geometry}
						material={matInt}
						position={[23.875, 15.67, 53.615]}
						scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]}
					/>
					<mesh
						geometry={nodes.Geom3D_tiroir_droit.geometry}
						material={matInt}
						position={[559.875 + deltaX, 15.67, 53.615]}
						scale={[25.4, 25.4 * scaleY_tiroir_prof, 25.4 * scaleZ_tiroir]}
					/>
					<mesh
						geometry={nodes.Geom3D_tiroir_face.geometry}
						material={facadeMaterial}
						position={[23.875, -2.33, 35.615]}
						scale={[25.4 * scaleX_tiroir_face, 25.4, 25.4 * scaleZ_tiroir]}
					/>
					<mesh
						geometry={nodes.Geom3D_tiroir_fond.geometry}
						material={matInt}
						position={[41.875, 569.67 + deltaY, 53.615]}
						scale={[25.4 * scaleX_tiroir_fond, 25.4, 25.4 * scaleZ_tiroir]}
					/>
					<mesh
						geometry={nodes.Geom3D_tiroir_bas.geometry}
						material={matInt}
						position={[1023.032 + deltaX * 1.87, 118.07 + deltaY * 0.207, 0]}
						scale={[25.4 * scaleX_tiroir_fond, 25.4 * scaleY_tiroir_prof, 25.4]}
					/>
				</group>,
			);
		}
		return <group ref={drawerRef}>{tiroirsGeneres}</group>;
	};

	const zOffsetPorte = hasDrawers && !isTiroirsInterieurs ? HAUTEUR_BLOC_TIROIR : 0;
	const scaleZPorte = hasDrawers && !isTiroirsInterieurs ? scaleZ_demi_porte : scaleZ_fond;

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
					<mesh
						geometry={nodes.Geom3D_traversse_bas.geometry}
						material={matExt}
						scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]}
					/>
					<mesh
						geometry={nodes.Geom3D_montant_droit.geometry}
						material={matExt}
						position={[0, 0, EPAISSEUR]}
						scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]}
					/>
					<mesh
						geometry={nodes.Geom3D_montant_gauche.geometry}
						material={matExt}
						position={[largeur - EPAISSEUR, 0, EPAISSEUR]}
						scale={[25.4, 25.4 * scaleY_profondeur, 25.4 * scaleZ_verticales]}
					/>
					<mesh
						geometry={nodes.Geom3D_traverse_haut.geometry}
						material={matExt}
						position={[0, 0, hauteur - EPAISSEUR]}
						scale={[25.4 * scaleX_horizontales, 25.4 * scaleY_profondeur, 25.4]}
					/>
					<mesh
						geometry={nodes.Geom3D_fond_arrière.geometry}
						material={matInt}
						position={[0, profondeur, 0]}
						scale={[25.4 * scaleX_horizontales, 25.4, 25.4 * scaleZ_fond]}
					/>

					{activeConfig === 0 && renderEtagere(hauteur / 2, "etagere-centre")}

					{[1, 6, 7].includes(activeConfig) && (
						<group>
							{renderTiroirs()}
							{renderEtagere(hauteur - 300, "etagere-haute")}
							{renderPenderie(hauteur - 300, "penderie-1")}
						</group>
					)}

					{activeConfig === 2 && <group> {[1, 2, 3, 4].map((i) => renderEtagere((hauteur / 5) * i, `etagere-biblio-${i}`))} </group>}

					{activeConfig === 3 && (
						<group>
							{renderEtagere(hauteur - 300, "etagere-cachee")}
							{renderPenderie(hauteur - 300, "penderie-cachee")}
						</group>
					)}

					{[4, 8].includes(activeConfig) && renderTiroirs()}

					{activeConfig === 5 && (
						<group>
							{renderEtagere(hauteur - 300, "etagere-penderie")}
							{renderPenderie(hauteur - 300, "barre-penderie-simple")}
						</group>
					)}

					{renderPortes(zOffsetPorte, scaleZPorte)}

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
