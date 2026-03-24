import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { Caisson } from "./Caisson";

// --- THÈME DE L'INTERFACE ---
const theme = {
	panel: {
		width: "360px",
		background: "#ffffff",
		borderRight: "1px solid #e5e7eb",
		display: "flex",
		flexDirection: "column",
		height: "100vh",
		fontFamily: "'Inter', sans-serif",
		zIndex: 10,
		boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
	},
	header: { padding: "24px 24px 20px", borderBottom: "1px solid #f3f4f6", backgroundColor: "#ffffff" },
	titleH1: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#111827", letterSpacing: "-0.02em" },
	subtitle: { margin: "6px 0 0 0", fontSize: "13px", color: "#6b7280" },
	scrollArea: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "32px" },
	section: { display: "flex", flexDirection: "column", gap: "16px" },
	sectionHeader: { display: "flex", alignItems: "center", gap: "8px", borderBottom: "2px solid #f8fafc", paddingBottom: "10px" },
	sectionTitle: { margin: 0, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#111827" },
	grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
	inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },

	sliderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
	label: { fontSize: "13px", fontWeight: "600", color: "#374151", margin: 0 },
	valueBadge: { fontSize: "12px", fontWeight: "700", color: "#111827", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "6px" },
	slider: { width: "100%", cursor: "pointer", accentColor: "#111827" },

	input: {
		width: "100%",
		padding: "10px 12px",
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		fontSize: "14px",
		color: "#111827",
		backgroundColor: "#f9fafb",
		boxSizing: "border-box",
		outline: "none",
	},
	select: {
		width: "100%",
		padding: "10px 12px",
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		fontSize: "14px",
		color: "#111827",
		backgroundColor: "#f9fafb",
		cursor: "pointer",
		boxSizing: "border-box",
		outline: "none",
	},
	btnPrimary: {
		width: "100%",
		padding: "14px",
		background: "#111827",
		color: "#ffffff",
		border: "none",
		borderRadius: "8px",
		fontSize: "14px",
		fontWeight: "600",
		cursor: "pointer",
		display: "block",
		textAlign: "center",
		textDecoration: "none",
		boxSizing: "border-box",
		boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
		transition: "background 0.2s",
	},
	btnSecondary: {
		width: "100%",
		padding: "12px 10px",
		background: "#ffffff",
		color: "#111827",
		border: "1px solid #d1d5db",
		borderRadius: "8px",
		fontSize: "13px",
		fontWeight: "600",
		cursor: "pointer",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "8px",
		boxSizing: "border-box",
		transition: "all 0.2s",
		boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
	},
	colorPickerWrapper: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "8px 12px",
		borderRadius: "8px",
		border: "1px solid #d1d5db",
		background: "#f9fafb",
	},
	colorPicker: { width: "24px", height: "24px", border: "none", cursor: "pointer", background: "none", padding: 0 },
	checkboxWrapper: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "10px 12px",
		border: "1px solid #d1d5db",
		borderRadius: "8px",
		cursor: "pointer",
		background: "#f9fafb",
	},
	checkbox: { width: "16px", height: "16px", accentColor: "#111827", cursor: "pointer", margin: 0 },

	// --- NOUVEAUX STYLES POUR LE PANIER (DEVIS) ---
	quoteBox: {
		position: "absolute",
		top: "24px",
		right: "24px",
		backgroundColor: "#ffffff",
		padding: "24px",
		borderRadius: "16px",
		boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
		zIndex: 100,
		border: "1px solid #e5e7eb",
		display: "flex",
		flexDirection: "column",
		gap: "16px",
		minWidth: "240px",
		fontFamily: "'Inter', sans-serif",
	},
	quotePrice: { margin: 0, fontSize: "36px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em" },
	quoteLabel: { margin: "0 0 4px 0", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" },

	bottomBar: {
		position: "absolute",
		bottom: "32px",
		left: "50%",
		transform: "translateX(-50%)",
		backgroundColor: "#ffffff",
		padding: "20px 32px",
		borderRadius: "16px",
		boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
		display: "flex",
		gap: "32px",
		alignItems: "flex-end",
		zIndex: 100,
		border: "1px solid #e5e7eb",
	},
	bottomBarSection: { display: "flex", flexDirection: "column", gap: "10px", borderRight: "1px solid #e5e7eb", paddingRight: "32px" },
};

const Icons = {
	House: () => (
		<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
			<polyline points="9 22 9 12 15 12 15 22"></polyline>
		</svg>
	),
	Star: () => (
		<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
		</svg>
	),
	Layout: () => (
		<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
			<rect x="3" y="3" width="18" height="18" rx="2"></rect>
		</svg>
	),
	Box: () => (
		<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
			<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
		</svg>
	),
	Settings: () => (
		<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
			<circle cx="12" cy="12" r="3"></circle>
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
		</svg>
	),
};

// --- COMPOSANTS DE LA 3D ---
const AutoFitCamera = ({ largeurTotaleCM, hauteurs, orbitRef }) => {
	const { camera } = useThree();
	useEffect(() => {
		if (!orbitRef.current) return;
		const controls = orbitRef.current;
		const widthMeters = largeurTotaleCM / 100;
		const heightsArr = Object.values(hauteurs);
		const maxHMeters = heightsArr.length > 0 ? Math.max(...heightsArr) / 100 : 2;
		const centerHeight = maxHMeters / 2;
		controls.target.set(0, centerHeight, 0);
		const fov = (camera.fov * Math.PI) / 180;
		const fitHeightDistance = maxHMeters / (2 * Math.tan(fov / 2));
		const fitWidthDistance = widthMeters / camera.aspect / (2 * Math.tan(fov / 2));
		const idealDistance = Math.max(fitHeightDistance, fitWidthDistance) + 2.0;

		controls.minDistance = 1.0;
		controls.maxDistance = idealDistance + 1.0;

		const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
		spherical.radius = idealDistance;
		camera.position.setFromSpherical(spherical).add(controls.target);
		controls.update();
	}, [largeurTotaleCM, hauteurs, camera, orbitRef]);
	return null;
};

const RoomContext = ({ couleurMur, couleurSol, profondeurCM }) => {
	const zMur = -(profondeurCM / 99);
	return (
		<group position={[0, -0.01, 0]}>
			<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
				<planeGeometry args={[150, 150]} />
				<meshStandardMaterial color={couleurSol} roughness={0.9} metalness={0} />
			</mesh>
			<mesh receiveShadow position={[0, 25, zMur]}>
				<planeGeometry args={[150, 50]} />
				<meshStandardMaterial color={couleurMur} roughness={1} metalness={0} />
			</mesh>
		</group>
	);
};

// ============================================================================
// --- COMPOSANT PRINCIPAL ---
// ============================================================================
export default function DressingConfigurator() {
	const [selectedId, setSelectedId] = useState(null);
	const [configs, setConfigs] = useState({});
	const [hauteurs, setHauteurs] = useState({});
	const [tiroirsInt, setTiroirsInt] = useState({});

	// --- SIDEBAR GLOBALE ---
	const [largeurTotaleCM, setLargeurTotaleCM] = useState(120);
	const [profondeurCM, setProfondeurCM] = useState(60);
	const [finitionExt, setFinitionExt] = useState("Chêne");
	const [couleurExt, setCouleurExt] = useState("#e2b388");
	const [finitionInt, setFinitionInt] = useState("Couleur");
	const [couleurInt, setCouleurInt] = useState("#ffffff");
	const [avecPoignees, setAvecPoignees] = useState(true);
	const [couleurPoignees, setCouleurPoignees] = useState("#222222");
	const [avecLED, setAvecLED] = useState(false);

	const [couleurMur, setCouleurMur] = useState("#f1f5f9");
	const [couleurSol, setCouleurSol] = useState("#e5e7eb");

	const profondeur = profondeurCM * 10;
	const orbitRef = useRef(null);

	// =========================================================
	// LOGIQUE DE DÉCOUPE DES CAISSONS
	// =========================================================
	const GAP = 2;
	const MAX_DOOR_WIDTH = 500;
	const largeurTotaleMM = largeurTotaleCM * 10;

	const nbPortes = Math.ceil(largeurTotaleMM / MAX_DOOR_WIDTH);
	const nbCaissonsDoubles = Math.floor(nbPortes / 2);
	const nbCaissonsSimples = nbPortes % 2;

	const totalGaps = Math.max(0, nbCaissonsDoubles + nbCaissonsSimples - 1) * GAP;
	const largeurUtile = largeurTotaleMM - totalGaps;
	const largeurUnitePorte = largeurUtile / nbPortes;

	const caissonsData = [];
	for (let i = 0; i < nbCaissonsDoubles; i++) caissonsData.push({ width: largeurUnitePorte * 2, doorsCount: 2 });
	if (nbCaissonsSimples > 0) caissonsData.push({ width: largeurUnitePorte, doorsCount: 1 });

	// =========================================================
	// 🧮 L'ALGORITHME MAGIQUE DU DEVIS (TEMPS RÉEL)
	// =========================================================
	const totalPrice = useMemo(() => {
		let total = 0;

		for (let i = 0; i < caissonsData.length; i++) {
			const widthCM = caissonsData[i].width / 10;
			const heightCM = hauteurs[i] || 200;
			const depthCM = profondeurCM;
			const doors = caissonsData[i].doorsCount;
			const conf = configs[i] !== undefined ? configs[i] : 4;

			// 1. Structure du caisson (Volume)
			let caissonPrice = 50 + ((widthCM * heightCM * depthCM) / 10000) * 2.5;
			if (finitionInt === "Chêne") caissonPrice *= 1.3; // +30% pour le chêne

			// 2. Portes (Façades)
			let doorsPrice = doors * 35;
			if (finitionExt === "Chêne") doorsPrice *= 1.3;
			caissonPrice += doorsPrice;

			// 3. Aménagement Intérieur (Tiroirs & Étagères)
			let nbTiroirs = 0;
			if ([1, 4].includes(conf)) nbTiroirs = 2;
			if ([6, 8].includes(conf)) nbTiroirs = 3;
			if (conf === 7) nbTiroirs = 4;
			caissonPrice += nbTiroirs * 55; // Un tiroir coûte cher (rails métalliques)

			if (conf === 2) caissonPrice += 4 * 15; // Bibliothèque (4 étagères)
			if ([5].includes(conf)) caissonPrice += 25; // Penderie simple
			if ([1, 6, 7].includes(conf)) caissonPrice += 30; // Penderie + Séparation

			// 4. Accessoires
			if (avecLED) caissonPrice += 45; // Ruban LED + Transfo par caisson
			if (avecPoignees) caissonPrice += doors * 12; // Prix de la poignée

			total += caissonPrice;
		}

		return Math.round(total);
	}, [caissonsData, hauteurs, configs, profondeurCM, finitionExt, finitionInt, avecLED, avecPoignees]);

	// --- PRESETS MAGIQUES ---
	const loadPreset = (type) => {
		if (type === "suite") {
			setLargeurTotaleCM(300);
			setProfondeurCM(60);
			setFinitionExt("Chêne");
			setFinitionInt("Couleur");
			setCouleurInt("#1e293b");
			setAvecPoignees(true);
			setAvecLED(true);
			setConfigs({ 0: 5, 1: 7, 2: 5 });
			setHauteurs({ 0: 240, 1: 240, 2: 240 });
			setCouleurMur("#1e293b");
			setCouleurSol("#3f3f46");
		} else if (type === "entree") {
			setLargeurTotaleCM(120);
			setProfondeurCM(45);
			setFinitionExt("Couleur");
			setCouleurExt("#cbd5e1");
			setFinitionInt("Chêne");
			setAvecLED(false);
			setConfigs({ 0: 5, 1: 4 });
			setHauteurs({ 0: 200, 1: 200 });
			setCouleurMur("#ffffff");
			setCouleurSol("#d1d5db");
		} else if (type === "biblio") {
			setLargeurTotaleCM(240);
			setProfondeurCM(35);
			setFinitionExt("Chêne");
			setFinitionInt("Chêne");
			setAvecPoignees(false);
			setAvecLED(true);
			setConfigs({ 0: 2, 1: 2, 2: 2, 3: 2, 4: 2 });
			setHauteurs({ 0: 220, 1: 220, 2: 220, 3: 220, 4: 220 });
			setCouleurMur("#f1f5f9");
			setCouleurSol("#fef3c7");
		}
		setSelectedId(null);
	};

	const renderCaissons = () => {
		const caissonsGeneres = [];
		let currentPositionX = -largeurTotaleMM / 2;

		for (let i = 0; i < caissonsData.length; i++) {
			const currentConfig = configs[i] !== undefined ? configs[i] : 4;
			const currentHauteur = (hauteurs[i] || 200) * 10;
			const currentTiroirsInt = tiroirsInt[i] || false;
			const isRightHinge = i % 2 !== 0;

			caissonsGeneres.push(
				<Caisson
					key={i}
					position={[currentPositionX / 1000, 0, 0]}
					largeur={caissonsData[i].width}
					doorsCount={caissonsData[i].doorsCount}
					hauteur={currentHauteur}
					profondeur={profondeur}
					activeConfig={currentConfig}
					isSelected={selectedId === i}
					finitionExt={finitionExt}
					couleurExt={couleurExt}
					finitionInt={finitionInt}
					couleurInt={couleurInt}
					avecPoignees={avecPoignees}
					couleurPoignees={couleurPoignees}
					avecLED={avecLED}
					isTiroirsInterieurs={currentTiroirsInt}
					isRightHinge={isRightHinge}
					onClick={(e) => {
						e.stopPropagation();
						setSelectedId(i);
					}}
				/>,
			);
			currentPositionX += caissonsData[i].width + GAP;
		}
		return caissonsGeneres;
	};

	return (
		<div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
			{/* === SIDEBAR GLOBALE === */}
			<div style={theme.panel}>
				<div style={theme.header}>
					<h1 style={theme.titleH1}>Studio Dressing</h1>
					<p style={theme.subtitle}>Configurez votre rangement sur mesure</p>
				</div>

				<div style={theme.scrollArea}>
					<div style={theme.section}>
						<div style={theme.sectionHeader}>
							<Icons.Star />
							<h3 style={theme.sectionTitle}>Inspirations</h3>
						</div>
						<div style={theme.grid2}>
							<button onClick={() => loadPreset("suite")} style={theme.btnSecondary}>
								Suite Parentale
							</button>
							<button onClick={() => loadPreset("entree")} style={theme.btnSecondary}>
								Meuble Entrée
							</button>
							<button onClick={() => loadPreset("biblio")} style={theme.btnSecondary}>
								Bibliothèque
							</button>
						</div>
					</div>

					<div style={theme.section}>
						<div style={theme.sectionHeader}>
							<Icons.Layout />
							<h3 style={theme.sectionTitle}>Dimensions Globales</h3>
						</div>
						<div style={theme.inputGroup}>
							<div style={theme.sliderHeader}>
								<label style={theme.label}>Largeur totale</label>
								<span style={theme.valueBadge}>{largeurTotaleCM} cm</span>
							</div>
							<input
								type="range"
								min="40"
								max="600"
								value={largeurTotaleCM}
								onChange={(e) => setLargeurTotaleCM(Number(e.target.value))}
								style={theme.slider}
							/>
						</div>
						<div style={theme.inputGroup}>
							<div style={theme.sliderHeader}>
								<label style={theme.label}>Profondeur</label>
								<span style={theme.valueBadge}>{profondeurCM} cm</span>
							</div>
							<input
								type="range"
								min="30"
								max="100"
								value={profondeurCM}
								onChange={(e) => setProfondeurCM(Number(e.target.value))}
								style={theme.slider}
							/>
						</div>
					</div>

					<div style={theme.section}>
						<div style={theme.sectionHeader}>
							<Icons.Box />
							<h3 style={theme.sectionTitle}>Finitions du bois</h3>
						</div>
						<div style={theme.inputGroup}>
							<label style={theme.label}>Extérieur (Façades)</label>
							<div style={{ display: "flex", gap: "10px" }}>
								<select value={finitionExt} onChange={(e) => setFinitionExt(e.target.value)} style={{ ...theme.select, flex: 1 }}>
									<option value="Couleur">Couleur unie</option>
									<option value="Chêne">Bois (Chêne)</option>
								</select>
								<div style={theme.colorPickerWrapper}>
									<input type="color" value={couleurExt} onChange={(e) => setCouleurExt(e.target.value)} style={theme.colorPicker} />
								</div>
							</div>
						</div>
						<div style={theme.inputGroup}>
							<label style={theme.label}>Intérieur (Caissons)</label>
							<div style={{ display: "flex", gap: "10px" }}>
								<select value={finitionInt} onChange={(e) => setFinitionInt(e.target.value)} style={{ ...theme.select, flex: 1 }}>
									<option value="Couleur">Couleur unie</option>
									<option value="Chêne">Bois (Chêne)</option>
								</select>
								<div style={theme.colorPickerWrapper}>
									<input type="color" value={couleurInt} onChange={(e) => setCouleurInt(e.target.value)} style={theme.colorPicker} />
								</div>
							</div>
						</div>
					</div>

					<div style={theme.section}>
						<div style={theme.sectionHeader}>
							<Icons.Settings />
							<h3 style={theme.sectionTitle}>Accessoires</h3>
						</div>
						<div style={theme.inputGroup}>
							<label style={{ ...theme.checkboxWrapper, border: "none", padding: "0 0 8px 0", background: "transparent" }}>
								<input type="checkbox" checked={avecLED} onChange={(e) => setAvecLED(e.target.checked)} style={theme.checkbox} />
								<span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Éclairage LED intégré</span>
							</label>
							<label style={{ ...theme.checkboxWrapper, border: "none", padding: 0, background: "transparent" }}>
								<input type="checkbox" checked={avecPoignees} onChange={(e) => setAvecPoignees(e.target.checked)} style={theme.checkbox} />
								<span style={{ ...theme.label, margin: 0, fontSize: "14px" }}>Poignées en métal</span>
							</label>
							{avecPoignees && (
								<div style={{ ...theme.colorPickerWrapper, marginTop: "8px", width: "fit-content" }}>
									<span style={{ fontSize: "12px", color: "#6b7280", marginRight: "8px" }}>Couleur :</span>
									<input type="color" value={couleurPoignees} onChange={(e) => setCouleurPoignees(e.target.value)} style={theme.colorPicker} />
								</div>
							)}
						</div>
					</div>

					<div style={theme.section}>
						<div style={theme.sectionHeader}>
							<Icons.House />
							<h3 style={theme.sectionTitle}>🏠 Votre pièce</h3>
						</div>
						<div style={theme.grid2}>
							<div style={theme.inputGroup}>
								<label style={theme.label}>Couleur du mur</label>
								<div style={theme.colorPickerWrapper}>
									<input
										type="color"
										value={couleurMur}
										onChange={(e) => setCouleurMur(e.target.value)}
										style={{ ...theme.colorPicker, width: "100%" }}
									/>
								</div>
							</div>
							<div style={theme.inputGroup}>
								<label style={theme.label}>Couleur du sol</label>
								<div style={theme.colorPickerWrapper}>
									<input
										type="color"
										value={couleurSol}
										onChange={(e) => setCouleurSol(e.target.value)}
										style={{ ...theme.colorPicker, width: "100%" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* === ZONE 3D, PANIER ET BOTTOM BAR === */}
			<div style={{ flex: 1, position: "relative" }}>
				{/* 🛒 LE PANIER (DEVIS EN TEMPS RÉEL) */}
				<div style={theme.quoteBox}>
					<div>
						<p style={theme.quoteLabel}>Prix estimé TTC</p>
						<h2 style={theme.quotePrice}>{totalPrice.toLocaleString("fr-FR")} €</h2>
					</div>
					{/* <button
						style={theme.btnPrimary}
						onMouseEnter={(e) => (e.target.style.background = "#374151")}
						onMouseLeave={(e) => (e.target.style.background = "#111827")}
					>
						Ajouter au panier
					</button> */}
					{/* <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af", textAlign: "center", lineHeight: "1.4" }}>
						Fabrication sur-mesure.
						<br />
						Livraison offerte sous 4 à 6 semaines.
					</p> */}
				</div>

				{selectedId !== null && (
					<div style={theme.bottomBar}>
						<div style={theme.bottomBarSection}>
							<label style={theme.sectionTitle}>Agencement (Module {selectedId + 1})</label>
							<select
								value={configs[selectedId] !== undefined ? configs[selectedId] : 4}
								onChange={(e) => setConfigs((p) => ({ ...p, [selectedId]: Number(e.target.value) }))}
								style={{ ...theme.select, width: "260px" }}
							>
								<option value={0}>Vide (1 Étagère)</option>
								<option value={1}>Dressing (2 Tiroirs + Penderie)</option>
								<option value={6}>Dressing (3 Tiroirs + Penderie)</option>
								<option value={7}>Dressing (4 Tiroirs + Penderie)</option>
								<option value={4}>Mixte (Porte haute + 2 Tiroirs)</option>
								<option value={8}>Mixte (Porte haute + 3 Tiroirs)</option>
								<option value={2}>Bibliothèque (4 Étagères)</option>
								<option value={3}>Fermé (Porte totale)</option>
								<option value={5}>Penderie (Barre + Étagère)</option>
							</select>
						</div>
						<div style={{ ...theme.bottomBarSection, width: "200px" }}>
							<div style={theme.sliderHeader}>
								<label style={theme.sectionTitle}>Hauteur</label>
								<span style={theme.valueBadge}>{hauteurs[selectedId] || 200} cm</span>
							</div>
							<input
								type="range"
								min="60"
								max="300"
								value={hauteurs[selectedId] || 200}
								onChange={(e) => setHauteurs((p) => ({ ...p, [selectedId]: Number(e.target.value) }))}
								style={theme.slider}
							/>
						</div>
						{[1, 4, 6, 7, 8].includes(configs[selectedId] !== undefined ? configs[selectedId] : 4) && (
							<div style={{ ...theme.bottomBarSection, borderRight: "none", paddingRight: 0 }}>
								<label style={theme.sectionTitle}>Type de tiroirs</label>
								<select
									value={tiroirsInt[selectedId] ? "hidden" : "visible"}
									onChange={(e) => setTiroirsInt((p) => ({ ...p, [selectedId]: e.target.value === "hidden" }))}
									style={{ ...theme.select, width: "180px" }}
								>
									<option value="visible">Visibles (Extérieurs)</option>
									<option value="hidden">Cachés (Intérieurs)</option>
								</select>
							</div>
						)}
					</div>
				)}

				<Canvas shadows camera={{ position: [0, 1.5, 5], fov: 45 }}>
					<AutoFitCamera largeurTotaleCM={largeurTotaleCM} hauteurs={hauteurs} orbitRef={orbitRef} />
					<ambientLight intensity={0.4} />
					<directionalLight
						position={[5, 10, 5]}
						intensity={0.8}
						color="#fffbeb"
						castShadow
						shadow-mapSize-width={1024}
						shadow-mapSize-height={1024}
					/>
					<Environment preset="apartment" blur={0.5} />
					<ContactShadows position={[0, 0, 0]} opacity={0.65} scale={20} blur={2.5} far={2} resolution={1024} color="#1e293b" />
					<RoomContext couleurMur={couleurMur} couleurSol={couleurSol} profondeurCM={profondeurCM} />
					<group onPointerMissed={() => setSelectedId(null)}>{renderCaissons()}</group>
					<OrbitControls
						ref={orbitRef}
						makeDefault
						minPolarAngle={Math.PI / 8}
						maxPolarAngle={Math.PI / 2 - 0.05}
						minAzimuthAngle={-Math.PI / 4}
						maxAzimuthAngle={Math.PI / 4}
						enableDamping
						dampingFactor={0.05}
					/>
				</Canvas>
			</div>
		</div>
	);
}
