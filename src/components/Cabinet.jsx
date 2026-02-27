import React, { useState, useEffect, useRef } from "react";
import { useControls } from "leva";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
function EditeurCase({ selectedCell, cellsData, setCellsData }) {
	const currentData = selectedCell && cellsData[selectedCell] ? cellsData[selectedCell] : { type: "vide", charniere: "gauche", poignee: true };

	const [values, set] = useControls(
		"2. ÉDITION DE LA CASE",
		() => ({
			info: {
				value: "Cliquez sur une case !",
				editable: false,
				render: () => selectedCell === null,
			},
			type: {
				options: { Vide: "vide", Porte: "porte", Tiroir: "tiroir" },
				value: currentData.type,
				render: () => selectedCell !== null,
			},
			charniere: {
				options: { Gauche: "gauche", Droite: "droite" },
				value: currentData.charniere,
				render: (get) => selectedCell !== null && get("2. ÉDITION DE LA CASE.type") === "porte",
			},
			poignee: {
				value: currentData.poignee !== undefined ? currentData.poignee : true,
				label: "Avec poignée",
				render: (get) => selectedCell !== null && get("2. ÉDITION DE LA CASE.type") === "tiroir",
			},
		}),
		[selectedCell],
	);

	useEffect(() => {
		if (selectedCell) {
			const data = cellsData[selectedCell] || { type: "vide", charniere: "gauche", poignee: true };
			set({ type: data.type, charniere: data.charniere, poignee: data.poignee !== undefined ? data.poignee : true });
		}
	}, [selectedCell, set]);

	useEffect(() => {
		if (!selectedCell) return;

		setCellsData((prev) => {
			const oldData = prev[selectedCell] || { type: "vide", charniere: "gauche", poignee: true };

			if (oldData.type === values.type && oldData.charniere === values.charniere && oldData.poignee === values.poignee) return prev;

			return {
				...prev,
				[selectedCell]: { type: values.type, charniere: values.charniere, poignee: values.poignee },
			};
		});
	}, [values.type, values.charniere, values.poignee, selectedCell, setCellsData]);

	return null;
}
function Cellule({ id, posX, posY, largeur, hauteur, profondeur, couleurFacade, isSelected, cellData, onClick }) {
	const [hovered, setHovered] = useState(false);
	const porteRef = useRef();
	const tiroirRef = useRef();

	useEffect(() => {
		document.body.style.cursor = hovered ? "pointer" : "auto";
		return () => {
			document.body.style.cursor = "auto";
		};
	}, [hovered]);

	const epaisseurFacade = 2;
	const positionZFacade = profondeur / 2 - epaisseurFacade / 2;

	const { type, charniere, poignee = true } = cellData;

	const wFaçade = largeur - 0.4;
	const hFaçade = hauteur - 0.4;
	const wBoite = largeur - 2;
	const hBoite = Math.max(hFaçade - 4, 2);
	const profTiroir = Math.max(profondeur - 4, 10);
	const epTiroir = 1.2;

	const yBoite = -hFaçade / 2 + hBoite / 2 + 1;
	const zBoite = -profTiroir / 2 - epaisseurFacade / 2;

	useFrame((state, delta) => {
		if (porteRef.current) {
			const angleOuverture = charniere === "gauche" ? -Math.PI / 3 : Math.PI / 3;
			const rotationCible = hovered ? angleOuverture : 0;
			porteRef.current.rotation.y = THREE.MathUtils.lerp(porteRef.current.rotation.y, rotationCible, 10 * delta);
		}
		if (tiroirRef.current) {
			const positionZCible = hovered ? positionZFacade + profondeur * 0.65 : positionZFacade;
			tiroirRef.current.position.z = THREE.MathUtils.lerp(tiroirRef.current.position.z, positionZCible, 10 * delta);
		}
	});

	const glowColor = isSelected ? "#ffcc00" : "#ffffff";
	const glowOpacity = isSelected ? 0.5 : hovered ? 0.3 : 0;
	const facadeEmissive = isSelected ? "#444444" : hovered ? "#222222" : "#000000";

	return (
		<group position={[posX, posY, 0]}>
			{type === "vide" && (
				<mesh
					onClick={(e) => {
						e.stopPropagation();
						onClick(id);
					}}
					onPointerOver={(e) => {
						e.stopPropagation();
						setHovered(true);
					}}
					onPointerOut={(e) => {
						e.stopPropagation();
						setHovered(false);
					}}
				>
					<boxGeometry args={[largeur, hauteur, profondeur]} />
					<meshBasicMaterial color={glowColor} transparent opacity={glowOpacity} depthWrite={false} />
				</mesh>
			)}

			{type === "porte" && (
				<group ref={porteRef} position={[charniere === "gauche" ? -largeur / 2 + 0.2 : largeur / 2 - 0.2, 0, positionZFacade]}>
					<mesh
						position={[charniere === "gauche" ? wFaçade / 2 : -wFaçade / 2, 0, 0]}
						onClick={(e) => {
							e.stopPropagation();
							onClick(id);
						}}
						onPointerOver={(e) => {
							e.stopPropagation();
							setHovered(true);
						}}
						onPointerOut={(e) => {
							e.stopPropagation();
							setHovered(false);
						}}
					>
						<boxGeometry args={[wFaçade, hFaçade, epaisseurFacade]} />
						<meshStandardMaterial color={couleurFacade} emissive={facadeEmissive} roughness={0.5} />
					</mesh>
				</group>
			)}

			{type === "tiroir" && (
				<group
					ref={tiroirRef}
					position={[0, 0, positionZFacade]}
					onClick={(e) => {
						e.stopPropagation();
						onClick(id);
					}}
					onPointerOver={(e) => {
						e.stopPropagation();
						setHovered(true);
					}}
					onPointerOut={(e) => {
						e.stopPropagation();
						setHovered(false);
					}}
				>
					<mesh>
						<boxGeometry args={[wFaçade, hFaçade, epaisseurFacade]} />
						<meshStandardMaterial color={couleurFacade} emissive={facadeEmissive} roughness={0.5} />
					</mesh>
					{poignee && (
						<mesh position={[0, 0, epaisseurFacade / 2 + 1]} rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[1.5, 1.5, 2, 16]} />
							<meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
						</mesh>
					)}

					<group position={[0, yBoite, zBoite]}>
						<mesh position={[-wBoite / 2 + epTiroir / 2, 0, 0]}>
							<boxGeometry args={[epTiroir, hBoite, profTiroir]} />
							<meshStandardMaterial color="#e6d5b8" roughness={0.8} />
						</mesh>
						<mesh position={[wBoite / 2 - epTiroir / 2, 0, 0]}>
							<boxGeometry args={[epTiroir, hBoite, profTiroir]} />
							<meshStandardMaterial color="#e6d5b8" roughness={0.8} />
						</mesh>
						<mesh position={[0, 0, -profTiroir / 2 + epTiroir / 2]}>
							<boxGeometry args={[wBoite - epTiroir * 2, hBoite, epTiroir]} />
							<meshStandardMaterial color="#e6d5b8" roughness={0.8} />
						</mesh>
						<mesh position={[0, -hBoite / 2 + 0.5, 0]}>
							<boxGeometry args={[wBoite - epTiroir * 2, 1, profTiroir - epTiroir]} />
							<meshStandardMaterial color="#e6d5b8" roughness={0.8} />
						</mesh>
					</group>
				</group>
			)}
		</group>
	);
}

// --- LE CAISSON ---
function Caisson({ indexCaisson, positionX, largeur, config, epaisseur, epaisseurFond, texturesBois, selectedCell, onCellClick, cellsData }) {
	const espaceLargeur = (largeur - epaisseur * 2 - epaisseur * (config.colonnes - 1)) / config.colonnes;
	const espaceHauteur = (config.hauteur - epaisseur * 2 - epaisseur * (config.rangees - 1)) / config.rangees;
	const startX = -largeur / 2 + epaisseur;
	const startY = epaisseur;

	const MateriauBois = () => (
		<meshStandardMaterial
			map={texturesBois.map}
			normalMap={texturesBois.normalMap}
			roughnessMap={texturesBois.roughnessMap}
			color={config.bois === "noyer" ? "#a6886f" : "#ffffff"}
		/>
	);

	return (
		<group position={[positionX, 0, 0]}>
			<mesh position={[0, config.hauteur / 2, -config.profondeur / 2 + epaisseurFond / 2]}>
				<boxGeometry args={[largeur, config.hauteur, epaisseurFond]} />
				<MateriauBois />
			</mesh>
			<mesh position={[0, epaisseur / 2, 0]}>
				<boxGeometry args={[largeur, epaisseur, config.profondeur]} />
				<MateriauBois />
			</mesh>
			<mesh position={[0, config.hauteur - epaisseur / 2, 0]}>
				<boxGeometry args={[largeur, epaisseur, config.profondeur]} />
				<MateriauBois />
			</mesh>

			<mesh position={[-largeur / 2 + epaisseur / 2, config.hauteur / 2, 0]}>
				<boxGeometry args={[epaisseur, config.hauteur - epaisseur * 2, config.profondeur]} />
				<MateriauBois />
			</mesh>
			<mesh position={[largeur / 2 - epaisseur / 2, config.hauteur / 2, 0]}>
				<boxGeometry args={[epaisseur, config.hauteur - epaisseur * 2, config.profondeur]} />
				<MateriauBois />
			</mesh>

			{Array.from({ length: config.colonnes - 1 }).map((_, colIndex) => {
				const posX = startX + espaceLargeur * (colIndex + 1) + epaisseur * colIndex + epaisseur / 2;
				return (
					<mesh key={`col-${colIndex}`} position={[posX, config.hauteur / 2, 0]}>
						<boxGeometry args={[epaisseur, config.hauteur - epaisseur * 2, config.profondeur]} />
						<MateriauBois />
					</mesh>
				);
			})}

			{Array.from({ length: config.colonnes }).map((_, colIndex) => {
				const posX = startX + espaceLargeur * colIndex + epaisseur * colIndex + espaceLargeur / 2;
				return Array.from({ length: config.rangees - 1 }).map((_, rowIndex) => {
					const posY = startY + espaceHauteur * (rowIndex + 1) + epaisseur * rowIndex + epaisseur / 2;
					return (
						<mesh key={`shelf-${colIndex}-${rowIndex}`} position={[posX, posY, 0]}>
							<boxGeometry args={[espaceLargeur, epaisseur, config.profondeur]} />
							<MateriauBois />
						</mesh>
					);
				});
			})}

			{Array.from({ length: config.colonnes }).map((_, colIndex) => {
				const posX = startX + espaceLargeur * colIndex + epaisseur * colIndex + espaceLargeur / 2;
				return Array.from({ length: config.rangees }).map((_, rowIndex) => {
					const posY = startY + espaceHauteur * rowIndex + epaisseur * rowIndex + espaceHauteur / 2;
					const cellId = `c${indexCaisson}-${colIndex}-${rowIndex}`;
					const isSelected = selectedCell === cellId;
					const cellData = cellsData[cellId] || { type: "vide", charniere: "gauche", poignee: true };

					return (
						<Cellule
							key={cellId}
							id={cellId}
							posX={posX}
							posY={posY}
							largeur={espaceLargeur}
							hauteur={espaceHauteur}
							profondeur={config.profondeur}
							couleurFacade={config.couleurFacades}
							isSelected={isSelected}
							cellData={cellData}
							onClick={onCellClick}
						/>
					);
				});
			})}
		</group>
	);
}

export function Cabinet() {
	const [selectedCell, setSelectedCell] = useState(null);
	const [cellsData, setCellsData] = useState({});

	const config = useControls("1. CONFIGURATION GÉNÉRALE", {
		bois: { options: { Chêne: "chene", Noyer: "noyer" } },
		couleurFacades: { options: { "Blanc Mat": "#f0f0f0", "Gris Anthracite": "#363636", "Vert Sauge": "#8a9a86" } },
		hauteur: { value: 120, min: 40, max: 240, step: 10 },
		largeurTotale: { value: 120, min: 40, max: 300, step: 10 },
		profondeur: { value: 35, min: 20, max: 60, step: 5 },
		colonnes: { value: 2, min: 1, max: 4, step: 1 },
		rangees: { value: 4, min: 1, max: 8, step: 1 },
	});

	const epaisseur = 2;
	const epaisseurFond = 0.5;
	const largeurMaxCaisson = 60;

	// 1. On calcule combien de caissons de 60cm max on peut faire rentrer dans la largeur totale
	const nbCaissons = Math.max(1, Math.ceil(config.largeurTotale / largeurMaxCaisson));

	// 2. On recalcule la largeur exacte de CHAQUE caisson pour qu'ils remplissent l'espace (en tenant compte des panneaux partagés)
	const largeurCaisson = (config.largeurTotale + (nbCaissons - 1) * epaisseur) / nbCaissons;

	const texturesBois = useTexture({
		map: "/textures/oak/chene_color.jpg",
		normalMap: "/textures/oak/chene_normal.jpg",
		roughnessMap: "/textures/oak/chene_roughness.jpg",
	});
	texturesBois.map.wrapS = texturesBois.map.wrapT = THREE.RepeatWrapping;
	texturesBois.normalMap.wrapS = texturesBois.normalMap.wrapT = THREE.RepeatWrapping;
	texturesBois.roughnessMap.wrapS = texturesBois.roughnessMap.wrapT = THREE.RepeatWrapping;
	texturesBois.map.repeat.set(1, 1);
	texturesBois.normalMap.repeat.set(1, 1);
	texturesBois.roughnessMap.repeat.set(1, 1);

	const debutX = -config.largeurTotale / 2 + largeurCaisson / 2;

	const handleMissClick = () => setSelectedCell(null);

	return (
		<group onPointerMissed={handleMissClick}>
			<EditeurCase selectedCell={selectedCell} cellsData={cellsData} setCellsData={setCellsData} />

			{Array.from({ length: nbCaissons }).map((_, index) => {
				const positionX = debutX + index * (largeurCaisson - epaisseur);
				return (
					<Caisson
						key={`caisson-${index}`}
						indexCaisson={index}
						positionX={positionX}
						largeur={largeurCaisson}
						config={config}
						epaisseur={epaisseur}
						epaisseurFond={epaisseurFond}
						texturesBois={texturesBois}
						selectedCell={selectedCell}
						onCellClick={setSelectedCell}
						cellsData={cellsData}
					/>
				);
			})}
		</group>
	);
}
